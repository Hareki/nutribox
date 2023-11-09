import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { UpdateProductCategorySchema } from 'backend/dtos/categories/updateProductCategory.dto';
import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductCategoryModel } from 'models/productCategory.model';

type SuccessResponse = JSSuccess<ProductCategoryModel[] | ProductCategoryModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;

    const commonArgs: CommonArgs<ProductCategoryEntity> = {
      entity: ProductCategoryEntity,
    };

    if (keyword) {
      const data = (await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword,
          fieldName: 'name',
          limit: paginationParams.limit,
        },
      })) as ProductCategoryModel[];

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    } else {
      const [data, totalRecords] = await CommonService.getRecords({
        ...commonArgs,
        paginationParams,
      });

      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: data as ProductCategoryModel[],
      });
    }
  })
  .post(
    createValidationGuard(UpdateProductCategorySchema),
    async (req, res) => {
      try {
        const result = (await CommonService.createRecord(
          ProductCategoryEntity,
          req.body,
        )) as ProductCategoryModel;
        res.status(StatusCodes.CREATED).json({
          status: 'success',
          data: result,
        });
      } catch (error) {
        if (isDuplicateError(error)) {
          if (error.message.includes('UQ_PRODUCT_CATEGORY_NAME')) {
            throw new DuplicationError(
              'name',
              'ProductCategory.Name.Duplicate',
            );
          }
        }
        throw error;
      }
    },
  );

export default handler;
