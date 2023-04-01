import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

export interface ProfileMenuCount {
  addressCount: number;
  orderCount: number;
}
// API used to count all address and order to display on the right hand side of menu
const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ProfileMenuCount>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const accountId = req.query.id as string;

  const addressCountPromise = AccountController.countAddress(accountId);
  const orderCountPromise = AccountController.countOrder(accountId);

  const resolved = await Promise.all([addressCountPromise, orderCountPromise]);
  const result = {
    addressCount: resolved[0],
    orderCount: resolved[1].total,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
