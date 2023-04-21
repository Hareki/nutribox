import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import { virtuals } from 'api/mssql/virtuals';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<boolean>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  // await connectToDB();

  const accountId = req.body.accountId as string;
  const oldPassword = req.body.oldPassword as string;
  // console.log('file: check-password.ts:17 - accountId:', accountId);
  // console.log('file: check-password.ts:19 - oldPassword:', oldPassword);
  // console.log(req.url);

  const queryResult = await executeUsp<unknown, { Password: string }>(
    'usp_Account_FetchPasswordById',
    [
      {
        name: 'AccountId',
        type: sql.UniqueIdentifier,
        value: accountId,
      },
      {
        name: 'Password',
        type: sql.NVarChar,
        value: null,
        isOutput: true,
      },
    ],
  );

  const accountPassword = queryResult.output.Password;

  const isPasswordValid = await virtuals.isPasswordMatch(
    oldPassword, // plain
    accountPassword, // hashed
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: isPasswordValid,
  });
});

export default handler;
