import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { sendVerificationEmail } from '../../../mailer';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<string>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  await sendVerificationEmail(req.body.email as string);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: 'Verification email sent',
  });
});

export default handler;
