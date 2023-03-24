import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getAllProducts } from 'api/base/server-side-getters';
import connectToDB from 'api/database/databaseConnection';
import type { IUpeProduct } from 'api/models/Product.model/types';
import type { GetInfinitePaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

type Pagination = GetInfinitePaginationResult<IUpeProduct>;

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<Pagination>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { docsPerPage, page } = req.query;

  const result = await getAllProducts(docsPerPage as string, page as string);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
