import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { populateAscUnexpiredExpiration } from 'api/helpers/model.helper';
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

  const { name } = req.query;

  const products = await ProductController.getAll({
    filter: {
      name: { $regex: name as string, $options: 'i' },
      available: true,
    },
    limit: 10,
  });

  const populatedProducts = await populateAscUnexpiredExpiration(products);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: populatedProducts,
  });
});

export default handler;
