import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import ExpirationModel from 'api/models/Expiration.model';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  // await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c278' });
  // await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c279' });
  // await ExpirationModel().findOneAndDelete({ _id: '64198eb215b75e0b2cd4c277' });

  const expDoc = await ExpirationModel().findById('64198efa15b75e0b2cd4c2aa');
  expDoc.quantity = 5;
  await expDoc.save();

  const expDoc2 = await ExpirationModel().findById('64198efa15b75e0b2cd4c2aa');
  console.log(expDoc2);
  // console.log('=========================');
  // console.log('file: test.ts:53 - expirations:', expirations);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: expDoc2,
  });
});

export default handler;
