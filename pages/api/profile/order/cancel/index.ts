import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type {
  ICustomerOrderWithItems,
  ICustomerOrderWithJsonItems,
} from 'api/mssql/pojos/customer_order.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface CancelOrderRequestBody {
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrderWithItems>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  const { id } = req.body as CancelOrderRequestBody;

  try {
    const cancelledOrderWithJsonItems = (
      await executeUsp<ICustomerOrderWithJsonItems>('usp_CancelOrder', [
        {
          name: 'CustomerOrderId',
          type: sql.UniqueIdentifier,
          value: id,
        },
      ])
    ).data[0];

    const cancelledOrderWithItems: ICustomerOrderWithItems = {
      ...cancelledOrderWithJsonItems,
      items: JSON.parse(cancelledOrderWithJsonItems.items),
    };

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: cancelledOrderWithItems,
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Order cannot be cancelled',
    });
    return;
  }
});

export default handler;
