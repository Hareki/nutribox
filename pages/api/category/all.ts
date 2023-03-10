import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductCategoryController from 'api/controllers/ProductCategory.controller';
import connectToDB from 'api/database/databaseConnection';
import { IProductCategory } from 'api/models/ProductCategory.model/types';
import { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IProductCategory[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { populate } = req.query;

  const categories = await ProductCategoryController.getAll({
    populate: populate ? ['products'] : undefined,
  });
  // console.log('file: all.ts:24 - categories:', categories);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: categories,
  });
});

export default handler;
