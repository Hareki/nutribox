import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import type { IProduct } from 'api/models/Product.model/types';
import type {
  GetPaginationPrerenderResult,
  GetPaginationResult,
} from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

type UnionPagination =
  | GetPaginationResult<IProduct>
  | GetPaginationPrerenderResult<IProduct>;

const handler = nc<
NextApiRequest,
NextApiResponse<JSendResponse<UnionPagination>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { populate, docsPerPage, page, prerender } = req.query;
  const totalDocs = await ProductController.getTotal();

  const { skip, limit, nextPageNum } = getPaginationParams({
    docsPerPage: docsPerPage as string,
    page: page as string,
    totalDocs,
  });

  const products = await ProductController.getAll({
    populate: populate ? ['category'] : undefined,
    skip,
    limit,
  });

  const result = {
    nextPageNum,
    totalDocs,
    docs: products,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
