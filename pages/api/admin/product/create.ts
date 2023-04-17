import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type {
  IPopulatedCategoryProduct,
  IProduct,
} from 'api/models/Product.model/types';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';

export interface CreateProductRb
  extends Omit<
    IProduct,
    'id' | 'expirations' | 'defaultSupplier' | 'category' | 'slug' | 'imageUrls'
  > {
  category: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    | JSendSuccessResponse<IPopulatedCategoryProduct>
    | JSendFailResponse<Record<string, string>>
    | JSendErrorResponse
  >
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as CreateProductRb;

  const product = await ProductController.createOne(requestBody);
  const populatedProduct = (await ProductController.getOne({
    id: product.id,
    populate: ['category'],
  })) as unknown as IPopulatedCategoryProduct;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: populatedProduct,
  });
});

export default handler;
