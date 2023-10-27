import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { ProductEntity } from 'backend/entities/product.entity';
import {
  getPaginationParams,
  setPaginationHeader,
} from 'backend/helpers/req.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import type { CommonArgs } from 'backend/services/common/helper';
import { type CommonProductModel } from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<CommonProductModel[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const paginationParams = getPaginationParams(req);
  const keyword = req.query.keyword as string;
  const category = req.query.category as string;

  const commonArgs: Partial<CommonArgs<ProductEntity>> = {
    filter: {
      productCategory: { available: true, ...(category && { id: category }) },
      available: true,
    },
  };

  if (keyword) {
    const data = await ProductService.getCommonProductsByKeyword({
      ...commonArgs,
      searchParams: {
        keyword,
        fieldName: 'name',
        limit: paginationParams.limit,
      },
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data,
    });
  } else {
    const [data, totalRecords] = await ProductService.getCommonProducts({
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
