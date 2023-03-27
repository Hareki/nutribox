import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import connectToDB from 'api/database/databaseConnection';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { OrderStatus } from 'utils/constants';

export interface UpdateOrderStatusRb {
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrder>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as UpdateOrderStatusRb;
  console.log('file: update.ts:26 - requestBody:', requestBody);
  const id = requestBody.id;
  console.log('file: update.ts:28 - id:', id);
  const canUpdate =
    id !== OrderStatus.Cancelled.id && id !== OrderStatus.Delivered.id;

  if (!canUpdate) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Đơn hàng đã huỷ hoặc đã giao, không thể cập nhật trạng thái',
    });
    return;
  }
  const updatedOrder = await CustomerOrderController.updateOrderStatus(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedOrder,
  });
});

export default handler;
