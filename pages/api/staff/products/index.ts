import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { NewProductDtoSchema } from 'backend/dtos/product/newProduct.dto';
import { ProductEntity } from 'backend/entities/product.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import { ExtendedCommonProductRelations } from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import type { ProductModel } from 'models/product.model';

type SuccessResponse = JSSuccess<ExtendedCommonProductModel[] | ProductModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler
  .get(async (req, res) => {
    const paginationParams = getPaginationParams(req);
    const keyword = req.query.keyword as string;

    const commonArgs: CommonArgs<ProductEntity> = {
      entity: ProductEntity,
      relations: ExtendedCommonProductRelations,
    };

    if (keyword) {
      const data = (await CommonService.getRecordsByKeyword({
        ...commonArgs,
        searchParams: {
          keyword,
          fieldName: 'name',
          limit: paginationParams.limit,
        },
      })) as ExtendedCommonProductModel[];

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
        data: data as ExtendedCommonProductModel[],
      });
    }
  })
  .post(createValidationGuard(NewProductDtoSchema), async (req, res) => {
    const newProduct = (await CommonService.createRecord(
      ProductEntity,
      req.body,
    )) as ProductModel;

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: newProduct,
    });
  });

export default handler;
