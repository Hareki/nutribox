import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getHotProducts } from 'api/base/pre-render';
import connectToDB from 'api/database/databaseConnection';
import type { IProduct } from 'api/models/Product.model/types';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IProduct[]>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { populate } = req.query;
  const isPopulate = populate === 'true';

  const products = await getHotProducts(isPopulate);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: products,
  });
});

export default handler;

