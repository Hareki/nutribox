import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getProduct } from 'api/base/server-side-modules/mssql-modules';
import type { PoIUpeProductWithImages } from 'api/mssql/pojos/product.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIUpeProductWithImages>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const id = req.query.id as string;

  const product = await getProduct(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: product,
  });
});

export default handler;
