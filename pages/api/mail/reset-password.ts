import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { hashPassword } from 'api/helpers/auth.helper';
import AccountModel from 'api/models/Account.model';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as {
    token: string;
    newPassword: string;
  };
  console.log('file: reset-password.ts:21 - token:', requestBody.token);

  console.log('---------------');
  console.log('newPassword before:', requestBody.newPassword);
  requestBody.newPassword = await hashPassword(requestBody.newPassword);
  console.log('newPassword after:', requestBody.newPassword);
  console.log('---------------');

  const account = await AccountModel().findOne({
    forgotPasswordToken: requestBody.token,
    forgotPasswordExpires: { $gt: Date.now() },
  });

  console.log('file: reset-password.ts:29 - account - account:', account);

  if (!account) {
    throw new Error('Account not found');
  }

  account.password = requestBody.newPassword;
  account.forgotPasswordToken = undefined;
  account.forgotPasswordExpires = undefined;

  await account.save();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'Password reset successfully',
  });
});

export default handler;
