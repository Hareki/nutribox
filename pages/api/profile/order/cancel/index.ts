import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import connectToDB from 'api/database/databaseConnection';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { AllStatusIdArray, CancelIndexThreshHold } from 'utils/constants';

export interface CancelOrderRequestBody {
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrder>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const { id } = req.body as CancelOrderRequestBody;

  const order = await CustomerOrderController.getOrder(id);
  const statusIndex = AllStatusIdArray.findIndex(
    (id) => id === order.status.toString(),
  );

  if (statusIndex > CancelIndexThreshHold) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Order cannot be cancelled',
    });
    return;
  }

  const cancelledOrder = await CustomerOrderController.cancelOrder(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: cancelledOrder,
  });
  return;
});

export default handler;