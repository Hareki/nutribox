import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

export interface OrderStatusCount {
  total: number;
  pending: number;
  processing: number;
  delivering: number;
  delivered: number;
}
const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<OrderStatusCount>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const accountId = req.query.id as string;

  const orderCount = await AccountController.countOrder(accountId);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: orderCount,
  });
});

export default handler;
