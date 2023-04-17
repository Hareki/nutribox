import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { populateAccountsTotalOrders } from 'api/helpers/model.helper';
import AccountModel from 'api/models/Account.model';
import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountWithTotalOrders[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { fullName } = req.query;

  const filter = [
    {
      $addFields: {
        fullName: {
          $concat: ['$lastName', ' ', '$firstName'],
        },
        id: { $toString: '$_id' },
      },
    },
    {
      $match: {
        fullName: { $regex: fullName, $options: 'i' },
      },
    },
    {
      $sort: { createdAt: -1, _id: 1 } as Record<string, 1 | -1>,
    },
    {
      $limit: AdminMainTablePaginationConstant.docsPerPage,
    },
  ];

  const accounts = await AccountModel().aggregate(filter).exec();

  const accountsWithTotalOrders = await populateAccountsTotalOrders(accounts);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: accountsWithTotalOrders,
  });
});

export default handler;
