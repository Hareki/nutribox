import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getRelatedProducts } from 'api/base/server-side-modules';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { IUpeProduct } from 'api/models/Product.model/types';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IUpeProduct[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { productId, categoryId } = req.query;
  const relatedProducts = await getRelatedProducts(
    productId as string,
    categoryId as string,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: relatedProducts,
  });
});

export default handler;
