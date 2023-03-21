import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getNewProducts } from 'api/base/server-side-getters';
import connectToDB from 'api/database/databaseConnection';
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

  const products = await getNewProducts();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: products,
  });
});

export default handler;
