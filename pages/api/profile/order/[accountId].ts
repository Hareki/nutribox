import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { PoICustomerOrder } from 'api/mssql/pojos/customer_order.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<PoICustomerOrder>>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const accountId = req.query.accountId as string;
  const { docsPerPage = '999', page = '1' } = req.query;

  const queryResult = await executeUsp<
    PoICustomerOrder,
    { TotalRecords: number; TotalPages: number }
  >('usp_CustomerOrders_FetchByPageAndAccountId', [
    {
      name: 'AccountId',
      type: sql.UniqueIdentifier,
      value: accountId,
    },
    {
      name: 'PageSize',
      type: sql.Int,
      value: parseInt(docsPerPage as string),
    },
    {
      name: 'PageNumber',
      type: sql.Int,
      value: parseInt(page as string),
    },
    {
      name: 'TotalRecords',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
    {
      name: 'TotalPages',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
    {
      name: 'NextPageNumber',
      type: sql.Int,
      value: null,
      isOutput: true,
    },
  ]);

  const customerOrders = queryResult.data;
  const totalDocs = queryResult.output.TotalRecords;
  const totalPages = queryResult.output.TotalPages;

  const result: GetAllPaginationResult<PoICustomerOrder> = {
    docs: customerOrders,
    totalDocs,
    totalPages,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
