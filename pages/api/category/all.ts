import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductCategoryController from 'api/controllers/ProductCategory.controller';
import connectToDB from 'api/database/databaseConnection';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import type { JSendResponse } from 'api/types/response.type';

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

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: categories,
  });
});

export default handler;
