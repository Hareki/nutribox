import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { PoICustomerOrder } from 'api/mssql/pojos/customer_order.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateOrderStatusRb {
  // Customer order id
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoICustomerOrder>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as UpdateOrderStatusRb;
  const customerOrderId = requestBody.id;

  try {
    const updatedOrder = (
      await executeUsp<PoICustomerOrder>('usp_CustomerOrder_UpdateStatus', [
        {
          name: 'CustomerOrderId',
          type: sql.UniqueIdentifier,
          value: customerOrderId,
        },
      ])
    ).data[0];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Đơn hàng đã huỷ hoặc đã giao, không thể cập nhật trạng thái',
    });
    return;
  }
});

export default handler;
