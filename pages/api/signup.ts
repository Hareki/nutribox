import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler } from 'next-connect';
import nc from 'next-connect';

import { defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { hashPassword } from 'api/helpers/auth.helper';
import { executeUsp } from 'api/helpers/mssql.helper';
import { getDuplicateValueMessageSQL } from 'api/helpers/schema.helper';
import type { IAccount } from 'api/mssql/pojos/account.pojo';
import { isDuplicateKey } from 'api/types/mongooseError.type';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';
import { Role } from 'utils/constants';

// export interface SignUpRequestBody
//   extends Pick<
//     IAccount,
//     'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'birthday'
//   > {}

export interface SignUpRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  birthday: Date;
}

export const onSignUpError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<
    JSendFailResponse<Record<string, string>> | JSendErrorResponse
  >
> = (err: any, _req, res) => {
  let response: Record<string, string>;
  // console.log(JSON.stringify(err));
  console.log(err);

  if (isDuplicateKey(err)) {
    response = getDuplicateValueMessageSQL(err.message);
  }
  // else if (instanceOfValidationError(err)) {
  //   response = getValidationErrorMessages(err);
  // }

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

  const data = {
    role: Role.Customer.id,
    ...requestBody,
    password: hashedPassword,
  };

  // const newAccount = await AccountController.createOne(data);

  const queryResult = await executeUsp<IAccount>('usp_Account_CreateOne', [
    {
      name: 'RoleId',
      type: sql.UniqueIdentifier,
      value: data.role,
    },
    {
      name: 'FirstName',
      type: sql.NVarChar,
      value: data.firstName,
    },
    {
      name: 'LastName',
      type: sql.NVarChar,
      value: data.lastName,
    },
    {
      name: 'Email',
      type: sql.NVarChar,
      value: data.email,
    },
    {
      name: 'Phone',

      type: sql.NVarChar,
      value: data.phone,
    },
    {
      name: 'Password',
      type: sql.NVarChar,
      value: data.password,
    },
    {
      name: 'Birthday',
      type: sql.DateTime2,
      value: data.birthday,
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: queryResult.data[0],
  });
});

export default handler;
