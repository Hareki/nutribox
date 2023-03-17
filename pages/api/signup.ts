import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler } from 'next-connect';
import nc from 'next-connect';


import { defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import { hashPassword } from 'api/helpers/auth.helper';
import {
  getDuplicateKeyErrorMessage,
  getValidationErrorMessages,
} from 'api/helpers/schema.helper';
import type { IAccount } from 'api/models/Account.model/types';
import {
  instanceOfDuplicateKeyError,
  instanceOfValidationError,
} from 'api/types/mongooseError.type';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';


export interface SignUpRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  birthday: string;
}


export const onSignUpError: ErrorHandler<
NextApiRequest,
NextApiResponse<
JSendFailResponse<Record<string, string>> | JSendErrorResponse
>
> = (err: any, _req, res) => {
  let response: Record<string, string>;
  console.log(JSON.stringify(err));

  if (instanceOfDuplicateKeyError(err)) {
    response = getDuplicateKeyErrorMessage(err);
  } else if (instanceOfValidationError(err)) {
    response = getValidationErrorMessages(err);
  }

  if (response) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      data: response,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
  });
};

const handler = nc<
NextApiRequest,
NextApiResponse<
| JSendSuccessResponse<IAccount>
| JSendFailResponse<Record<string, string>>
| JSendErrorResponse
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
