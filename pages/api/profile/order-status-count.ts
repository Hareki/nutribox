import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { countOrder } from 'api/base/server-side-modules/mssql-modules';
import type { JSendResponse } from 'api/types/response.type';

export interface OrderStatusCount {
  total: number;
  pending: number;
  processing: number;
  delivering: number;
  delivered: number;
}

export interface OrderStatusCountSQLOutput {
  Total: number;
  Pending: number;
  Processing: number;
  Delivering: number;
  Delivered: number;
}
const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<OrderStatusCount>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const accountId = req.query.id as string;

  const orderCount = await countOrder(accountId);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: orderCount,
  });
});

export default handler;
