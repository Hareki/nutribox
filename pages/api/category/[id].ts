import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CategoryController from 'api/controllers/ProductCategory.controller';
import connectToDB from 'api/database/databaseConnection';
import { populateUnexpiredExpiration } from 'api/helpers/model.helper';
import type {
  IPopulatedProductCategory,
  IPopulatedUpeProductCategory,
  IProductCategory,
} from 'api/models/ProductCategory.model/types';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<IProductCategory | IPopulatedUpeProductCategory>
  >
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const id = req.query.id as string;
  const category = await CategoryController.getOne({
    id,
    populate: ['products'],
  });

  const populatedCategory = category as IPopulatedProductCategory;

  console.log('==========');
  console.log('length 1:', populatedCategory.products.length);
  console.log('==========');

  const upeProducts = await populateUnexpiredExpiration(
    populatedCategory.products,
  );
  console.log('==========');
  console.log('length 2:', upeProducts.length);
  console.log('==========');

  const result = { ...category, products: upeProducts };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
