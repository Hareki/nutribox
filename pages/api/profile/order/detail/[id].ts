import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { getCustomerOrderWithJsonItems } from 'api/base/server-side-modules/mssql-modules';
import type { ICustomerOrderWithItems } from 'api/mssql/pojos/customer_order.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrderWithItems>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const orderId = req.query.id as string;

  const orderWithJsonItems = await getCustomerOrderWithJsonItems(orderId);

  const customerOrderWithItems: ICustomerOrderWithItems = {
    ...orderWithJsonItems,
    items: JSON.parse(orderWithJsonItems.items),
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: customerOrderWithItems,
  });
  return;
});

export default handler;
