import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import type { IAccountWithTotalOrders as IAccountWithTotalOrdersPojo } from 'api/mssql/pojos/account.pojo';
import type { JSendResponse } from 'api/types/response.type';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountWithTotalOrdersPojo[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { fullName } = req.query;

  // const filter = [
  //   {
  //     $addFields: {
  //       fullName: {
  //         $concat: ['$lastName', ' ', '$firstName'],
  //       },
  //       id: { $toString: '$_id' },
  //     },
  //   },
  //   {
  //     $match: {
  //       fullName: { $regex: fullName, $options: 'i' },
  //     },
  //   },
  //   {
  //     $sort: { createdAt: -1, _id: 1 } as Record<string, 1 | -1>,
  //   },
  //   {
  //     $limit: AdminMainTablePaginationConstant.docsPerPage,
  //   },
  // ];

  // const accounts = await AccountModel().aggregate(filter).exec();

  // const accountsWithTotalOrders = await populateAccountsTotalOrders(accounts);

  const accountsWithTotalOrders = (
    await executeUsp<IAccountWithTotalOrdersPojo>(
      'usp_FetchAccountsWithTotalOrdersByFullNameKeyword',
      [
        {
          name: 'Keyword',
          type: sql.NVarChar,
          value: fullName,
        },
        {
          name: 'Limit',
          type: sql.Int,
          value: AdminMainTablePaginationConstant.docsPerPage,
        },
      ],
    )
  ).data;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: accountsWithTotalOrders,
  });
});

export default handler;
