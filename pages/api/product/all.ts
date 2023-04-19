import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getAllProducts } from 'api/base/server-side-modules/mssql-modules';
import type { IUpeProduct } from 'api/mssql/pojos/product.pojo';
import type { GetInfinitePaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

export type InfiniteUpePaginationResult =
  GetInfinitePaginationResult<IUpeProduct>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<InfiniteUpePaginationResult>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const { docsPerPage, page } = req.query;

  const result = await getAllProducts(docsPerPage as string, page as string);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
