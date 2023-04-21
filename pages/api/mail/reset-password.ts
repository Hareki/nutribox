import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { hashPassword } from 'api/helpers/auth.helper';
import { executeUsp } from 'api/helpers/mssql.helper';
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

  await executeUsp('usp_Account_ResetPassword', [
    {
      name: 'Token',
      type: sql.VarChar,
      value: requestBody.token,
    },
    {
      name: 'NewPassword',
      type: sql.VarChar,
      value: requestBody.newPassword,
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'Password reset successfully',
  });
});

export default handler;
