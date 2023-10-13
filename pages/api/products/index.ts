import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { ProductEntity } from 'backend/entities/product.entity';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonArgs } from 'backend/services/common/helper';
import type { CommonProductModel } from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/utils/req.helper';

type SuccessResponse = JSSuccess<CommonProductModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const paginationParams = getPaginationParams(req);
  const keyword = req.query.keyword as string;
  const category = req.query.category as string;

  const commonArgs: CommonArgs<ProductEntity> = {
    entity: ProductEntity,
    relations: ['productImages', 'productCategory', 'importOrders'],
    filter: {
      productCategory: category,
    },
  };

  if (keyword) {
    const data = (await CommonService.getRecordsByKeyword({
      ...commonArgs,
      searchParams: {
        keyword: keyword,
        fieldName: 'name',
        limit: paginationParams.limit,
      },
    })) as CommonProductModel[];

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
      data: data as CommonProductModel[],
    });
  }
});

export default handler;
