import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getNewProducts } from 'api/base/server-side-modules/mssql-modules';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { PoIUpeProductWithImages } from 'api/mssql/pojos/product.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIUpeProductWithImages[]>>
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
