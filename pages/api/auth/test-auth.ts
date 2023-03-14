import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;
  const account = await AccountController.checkCredentials(email, password);

  let result: string;
  if (account) {
    result = 'account exists';
  } else {
    result = 'account does not exist';
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
