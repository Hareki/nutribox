import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base';

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get((req, res) => {
  res.status(StatusCodes.OK).end('Hello World!');
});

export default handler;
