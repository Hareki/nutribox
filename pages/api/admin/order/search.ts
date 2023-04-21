import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { fetchAdminSearchData } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { ICustomerOrder as ICustomerOrderPojo } from 'api/mssql/pojos/customer_order.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrderPojo[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const { id } = req.query;

  const orders = await fetchAdminSearchData<ICustomerOrderPojo>({
    keyword: id as string,
    procedureName: 'usp_FetchCustomerOrdersByIdKeyword',
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: orders,
  });
});

export default handler;
