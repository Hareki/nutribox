import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { fetchAdminSearchData } from 'api/helpers/mssql.helper';
// import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import type { IAccountWithTotalOrders as IAccountWithTotalOrdersPojo } from 'api/mssql/pojos/account.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountWithTotalOrdersPojo[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const { fullName } = req.query;

  const accountsWithTotalOrders =
    await fetchAdminSearchData<IAccountWithTotalOrdersPojo>({
      keyword: fullName as string,
      procedureName: 'usp_FetchAccountsWithTotalOrdersByFullNameKeyword',
    });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: accountsWithTotalOrders,
  });
});

export default handler;
