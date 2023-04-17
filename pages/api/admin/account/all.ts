import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { populateAccountsTotalOrders } from 'api/helpers/model.helper';
import { processPaginationParams } from 'api/helpers/pagination.helpers';
import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
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
  await connectToDB();

  const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
    req,
    AccountController.getTotal,
  );

  const accounts = await AccountController.getAll({
    sort: { createdAt: -1, _id: 1 },
    skip,
    limit,
  });

  const accountsWithTotalOrders = await populateAccountsTotalOrders(accounts);

  const result = {
    totalPages,
    totalDocs,
    docs: accountsWithTotalOrders,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
