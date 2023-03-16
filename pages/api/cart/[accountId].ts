import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc, { ErrorHandler } from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import { CustomError, CustomErrorCodes } from 'api/helpers/error.helper';
import { IAccount } from 'api/models/Account.model/types';
import {
  JSendErrorResponse,
  JSendFailResponse,
  JSendResponse,
} from 'api/types/response.type';
import { CartItemRequestBody } from 'utils/apiCallers/global/cart';

export const onSignUpError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSendFailResponse<string> | JSendErrorResponse>
> = (err: CustomError, _req, res) => {
  console.log(JSON.stringify(err));

  if (err.code === CustomErrorCodes.DOCUMENT_NOT_FOUND) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      data: err.message,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
  });
};

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IAccount>>>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();
  const requestBody = req.body as CartItemRequestBody;
  const accountId = req.query.accountId as string;

  const account = await AccountController.updateCart(accountId, requestBody);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: account,
  });
});

export default handler;
