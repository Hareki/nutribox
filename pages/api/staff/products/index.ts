import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { NewProductDtoSchema } from 'backend/dtos/product/newProduct.dto';
import { ProductEntity } from 'backend/entities/product.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { isDuplicateError } from 'backend/helpers/validation.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import { DuplicationError } from 'backend/types/errors/common';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductModel } from 'models/product.model';

type SuccessResponse = JSSuccess<
  ExtendedCommonProductModel[] | ExtendedCommonProductModel
>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;

    if (keyword) {
      const data =
        await ProductService.getCommonProductsByKeyword<ExtendedCommonProductModel>(
          {
            searchParams: {
              keyword,
              fieldName: 'name',
              limit: paginationParams.limit,
            },
            extended: true,
          },
        );

      res.status(StatusCodes.OK).json({
        status: 'success',
        data,
      });
    } else {
      const [data, totalRecords] =
        await ProductService.getCommonProducts<ExtendedCommonProductModel>({
          paginationParams,
        });

      setPaginationHeader(res, {
        ...paginationParams,
        totalRecords,
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: data as ExtendedCommonProductModel[],
      });
    }
  })
  .post(createValidationGuard(NewProductDtoSchema), async (req, res) => {
    try {
      const id = (
        (await CommonService.createRecord(
          ProductEntity,
          req.body,
        )) as ProductModel
      ).id;

      const newProduct =
        await ProductService.getCommonProduct<ExtendedCommonProductModel>({
          filter: {
            id,
          },
          extended: true,
        });

      res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: newProduct,
      });
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new DuplicationError('name', 'Product.Name.Duplicate');
      }
      throw error;
    }
  });

export default handler;
