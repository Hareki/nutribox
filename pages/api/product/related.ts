import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { IProduct } from 'api/models/Product.model/types';
import { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IProduct[]>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { productId, categoryId } = req.query;
  const relatedProducts = await ProductController.getRelatedProducts(
    { productId: productId as string, categoryId: categoryId as string },
    { limit: 4 },
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: relatedProducts,
  });
});

export default handler;
