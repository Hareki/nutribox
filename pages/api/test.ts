import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ExpirationController from 'api/controllers/Expiration.controller';
import connectToDB from 'api/database/databaseConnection';
import ExpirationModel from 'api/models/Expiration.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c278' });
  await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c279' });
  await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c277' });

  const expirations = await ExpirationController.getExpirationsByProductId(
    '640990a80009112a7a900b94',
  );
  // console.log('=========================');
  // console.log('file: test.ts:53 - expirations:', expirations);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: expirations,
  });
});

export default handler;
