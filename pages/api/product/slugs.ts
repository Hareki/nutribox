import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string[]>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (_req, res) => {
  await connectToDB();

  const products: { name: string; slug: string }[] =
    await ProductController.getAll({
      includeFields: ['name', 'slug'],
    });

  const slugs = products.map((product) => product.slug);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: slugs,
  });
});

export default handler;
