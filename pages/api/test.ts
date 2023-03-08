import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base';
import connectToDB from 'api/database/databaseConnection';
import { IProductInput } from 'api/models/Product.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  // new ProductCategory({ name: 'Thịt tươi sống' }).save();
  // new ProductCategory({ name: 'Nước giải khát' }).save();
  // new ProductCategory({ name: 'Sữa các loại' }).save();
  try {
    const data: IProductInput = {
      name: 'test',
      category: new Types.ObjectId('64087f60248e58a08bdc3e1c'),
      description: 'test',
      imageUrls: ['test'],
      wholesalePrice: 900,
      retailPrice: 1000,
      shelfLife: 10,
      available: true,
      hot: true,
    };
    // const test = await new Product(data);
    // const product = new Product(data);
    // await product.save();

    // Product.create(data);
  } catch (error) {
    console.log(error);
  }

  res.status(StatusCodes.OK).end('Hello World!');
});

export default handler;
