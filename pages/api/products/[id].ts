import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import type { CommonProductModel } from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import type { JSSuccess } from 'backend/types/jsend';
import { DEFAULT_RELATED_PRODUCTS_LIMIT } from 'constants/pagination.constant';

export type ProductResponseModel = CommonProductModel & {
  relatedProducts: CommonProductModel[];
};

type SuccessResponse = JSSuccess<ProductResponseModel>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const id = req.query.id as string;
  const limit = Number(req.query.limit) || DEFAULT_RELATED_PRODUCTS_LIMIT;
  const data = await ProductService.getProductWithRelatedProducts(id, limit);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
