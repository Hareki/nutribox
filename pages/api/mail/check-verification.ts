import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import AccountModel from 'api/models/Account.model';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<boolean>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  // POST method because we accept something like minhtu1392000+1@gmail.com, the plus symbol is not allowed in the URL.
  await connectToDB();
  const email = req.body.email as string;
  const { verified } = await AccountModel().findOne({
    email,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: verified,
  });
  return;
});

export default handler;
