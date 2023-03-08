import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base';
import connectToDB from 'api/database/databaseConnection';
import Product from 'api/models/Product.model';
import ProductCategory, {
  IProductCategoryInput,
} from 'api/models/ProductCategory.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  // new ProductCategory({ name: 'Thịt tươi sống' }).save();
  // new ProductCategory({ name: 'Nước giải khát' }).save();
  // new ProductCategory({ name: 'Sữa các loại' }).save();
  // new ProductCategory({ name: 'Mì, miến, cháo, phở' }).save();

  res.status(StatusCodes.OK).end('Hello World!');
});

export default handler;
