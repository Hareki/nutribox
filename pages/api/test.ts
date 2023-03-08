import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base';
import connectToDB from 'api/database/databaseConnection';
import ProductCategory from 'api/models/ProductCategory.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const result = new ProductCategory({ name: 'Rau củ' });
  result.save();
  res.status(StatusCodes.OK).end('Hello World!');
});

export default handler;
