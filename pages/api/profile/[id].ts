import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import { IAccount } from 'api/models/Account.model/types';
import { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IAccount>>>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();
  const { populate } = req.query;

  const id = req.query.id as string;
  const account = await AccountController.getOne({
    id,
    populate: populate ? ['category'] : undefined,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: account,
  });
});

export default handler;
