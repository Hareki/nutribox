import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { hashPassword } from 'api/helpers/auth.helper';
import type { IAccount } from 'api/models/Account.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateAccountRequestBody
  extends Partial<
    Pick<
      IAccount,
      'firstName' | 'lastName' | 'phone' | 'birthday' | 'avatarUrl' | 'password'
    >
  > {}

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IAccount>>>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;
    const account = await AccountController.getOne({
      id,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: account,
    });
  })
  .put(async (req, res) => {
    await connectToDB();
    const requestBody = req.body as UpdateAccountRequestBody;

    if (requestBody.password) {
      requestBody.password = await hashPassword(requestBody.password);
    }

    const id = req.query.id as string;
    console.log('file: [id].ts:47 - .put - id:', id);
    console.log('file: [id].ts:50 - .put - requestBody:', requestBody);

    const updatedAccount = await AccountController.updateOne(id, requestBody);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAccount,
    });
  });

export default handler;
