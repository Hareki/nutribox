import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { verifyAccount } from 'api/base/server-side-modules';
import connectToDB from 'api/database/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const success = verifyAccount(req.query.token as string);
  if (success) {
    res.status(StatusCodes.OK).json({
      status: 'success',
      data: 'Account verified successfully',
    });
    return;
  }

  res.status(StatusCodes.OK).json({
    status: 'fail',
    data: 'Token is invalid or has expired',
  });
});

export default handler;
