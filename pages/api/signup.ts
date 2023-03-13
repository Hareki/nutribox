import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import nc, { ErrorHandler } from 'next-connect';

import { SignUpRequestBody } from '../signup';

import { defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import { hashPassword } from 'api/helpers/auth.helper';
import {
  getDuplicateKeyErrorMessage,
  getValidationErrorMessages,
} from 'api/helpers/schema.helper';
import { IAccount } from 'api/models/Account.model/types';
import {
  instanceOfDuplicateKeyError,
  instanceOfValidationError,
} from 'api/types/mongooseError.type';
import {
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';

export const onSignUpError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSendFailResponse<Record<string, string>>>
> = (err: any, _req, res) => {
  let response: Record<string, string>;

  console.log(JSON.stringify(err));

  if (instanceOfDuplicateKeyError(err)) {
    response = getDuplicateKeyErrorMessage(err);
  } else if (instanceOfValidationError(err)) {
    response = getValidationErrorMessages(err);
  }

  const responseCode = StatusCodes.UNPROCESSABLE_ENTITY;
  res.status(responseCode).json({
    status: 'fail',
    data: response,
  });
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendSuccessResponse<IAccount> | JSendFailResponse<Record<string, string>>
  >
>({
  attachParams: true,
  onError: onSignUpError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();
  const requestBody = req.body as SignUpRequestBody;
  const hashedPassword = await hashPassword(requestBody.password);
  const data = { role: 'CUSTOMER', ...requestBody, password: hashedPassword };

  const newAccount = await AccountController.createOne(data);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: newAccount,
  });
});

export default handler;
