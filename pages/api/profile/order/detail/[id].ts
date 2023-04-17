import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrder>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const orderId = req.query.id as string;

  const customerOrder = await CustomerOrderController.getOrder(orderId);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: customerOrder,
  });
  return;
});

export default handler;
