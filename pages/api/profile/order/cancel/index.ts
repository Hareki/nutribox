import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getCustomerOrderWithJsonItems } from 'api/base/server-side-modules/mssql-modules';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { ICustomerOrderWithItems } from 'api/mssql/pojos/customer_order.pojo';
import type { JSendResponse } from 'api/types/response.type';
import { AllStatusIdArray, CancelIndexThreshHold } from 'utils/constants';

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

  const orderWithJsonItems = await getCustomerOrderWithJsonItems(id);

  const statusIndex = AllStatusIdArray.findIndex(
    (id) => id === orderWithJsonItems.status_id,
  );

  if (statusIndex > CancelIndexThreshHold) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Order cannot be cancelled',
    });
    return;
  }

  await executeUsp('usp_CancelOrder', [
    {
      name: 'CustomerOrderId',
      type: sql.UniqueIdentifier,
      value: id,
    },
  ]);

  const cancelledOrderWithJsonItems = await getCustomerOrderWithJsonItems(id);

  const cancelledOrderWithItems: ICustomerOrderWithItems = {
    ...cancelledOrderWithJsonItems,
    items: JSON.parse(cancelledOrderWithJsonItems.items),
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: cancelledOrderWithItems,
  });
});

export default handler;
