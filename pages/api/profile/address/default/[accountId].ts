import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { JSendResponse } from 'api/types/response.type';

export interface SetDefaultAddressRequestBody {
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountAddress[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();
  const requestBody = req.body as SetDefaultAddressRequestBody;
  const id = req.query.accountId as string;
  const updatedAddresses = await AccountController.setDefaultAddress(id, {
    id: requestBody.id,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedAddresses,
  });
});

export default handler;
