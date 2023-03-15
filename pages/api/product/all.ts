import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import { IProduct } from 'api/models/Product.model/types';
import {
  GetPaginationPrerenderResult,
  GetPaginationResult,
} from 'api/types/pagination.type';
import { JSendResponse } from 'api/types/response.type';

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
  // console.log('req.url:', req.url);

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

  // if (prerender) {
  //   const prerenderResult = {
  //     pages: [result],
  //     pageParams: [1],
  //   };

  //   res.status(StatusCodes.OK).json({
  //     status: 'success',
  //     data: prerenderResult,
  //   });

  //   return;
  // }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
