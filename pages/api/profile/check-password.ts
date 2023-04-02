import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<boolean>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  const accountId = req.body.accountId as string;
  console.log('file: check-password.ts:17 - accountId:', accountId);
  const oldPassword = req.body.oldPassword as string;
  console.log('file: check-password.ts:19 - oldPassword:', oldPassword);
  console.log(req.url);

  const isPasswordValid = await AccountController.checkPassword(
    accountId,
    oldPassword,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: isPasswordValid,
  });
});

export default handler;
