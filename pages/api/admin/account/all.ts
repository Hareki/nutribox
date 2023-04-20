import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
// import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import type { PaginationOutput } from 'api/helpers/mssql.helper';
import {
  executeUsp,
  extractPaginationOutputFromReq,
  getPaginationParamArray,
} from 'api/helpers/mssql.helper';
import type { IAccountWithTotalOrders } from 'api/mssql/pojos/account.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<GetAllPaginationResult<IAccountWithTotalOrders>>
  >
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  // await connectToDB();

  const { pageSize, pageNumber } = extractPaginationOutputFromReq(req);

  // const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
  //   req,
  //   AccountController.getTotal,
  // );

  // const accounts = await AccountController.getAll({
  //   sort: { createdAt: -1, _id: 1 },
  //   skip,
  //   limit,
  // });

  // const accountsWithTotalOrders = await populateAccountsTotalOrders(accounts);

  // const result = {
  //   totalPages,
  //   totalDocs,
  //   docs: accountsWithTotalOrders,
  // };

  const queryResult = await executeUsp<
    IAccountWithTotalOrders,
    PaginationOutput
  >(
    'usp_FetchAccountsWithTotalOrdersByPage',
    getPaginationParamArray({
      pageNumber: pageNumber,
      pageSize: pageSize,
    }),
  );

  const accountsWithTotalOrders = queryResult.data;
  const result = {
    totalPages: queryResult.output.TotalPages,
    totalDocs: queryResult.output.TotalRecords,
    docs: accountsWithTotalOrders,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
