import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getStore } from 'api/base/server-side-modules';
import connectToDB from 'api/database/databaseConnection';
import type { IStore } from 'api/models/Store.model/types';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IStore>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const id = req.query.id as string;
  const result = await getStore(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
