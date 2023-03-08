import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base';
import connectToDB from 'api/database/databaseConnection';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get((req, res) => {
  connectToDB();

  res.status(StatusCodes.OK).end('Hello World!');
});

export default handler;
