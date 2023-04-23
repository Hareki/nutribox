import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getAllCategories } from 'api/base/server-side-modules/mssql-modules';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { PoIProductCategory } from 'api/mssql/pojos/product_category.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIProductCategory[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const categories = await getAllCategories();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: categories,
  });
});

export default handler;
