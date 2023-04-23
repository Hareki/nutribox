import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
// import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import { fetchAdminPaginationData } from 'api/helpers/mssql.helper';
import { extractPaginationOutputFromReq } from 'api/helpers/mssql.helper';
import type { PoIAccountWithTotalOrders } from 'api/mssql/pojos/account.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<GetAllPaginationResult<PoIAccountWithTotalOrders>>
  >
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const { pageSize, pageNumber } = extractPaginationOutputFromReq(req);

  const result = await fetchAdminPaginationData<PoIAccountWithTotalOrders>({
    procedureName: 'usp_Accounts_FetchWithTotalOrdersByPage',
    pageNumber,
    pageSize,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
