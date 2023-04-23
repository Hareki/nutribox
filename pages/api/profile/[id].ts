import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { hashPassword } from 'api/helpers/auth.helper';
// import type { IAccount } from 'api/models/Account.model/types';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { IAccount } from 'api/models/Account.model/types';
import type { PoIAccount } from 'api/mssql/pojos/account.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateAccountRequestBody
  extends Partial<
    Pick<
      IAccount,
      'firstName' | 'lastName' | 'phone' | 'birthday' | 'avatarUrl' | 'password'
    >
  > {}

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<PoIAccount>>>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    const id = req.query.id as string;

    const account = (
      await executeUsp<PoIAccount>('usp_Account_FetchById', [
        {
          name: 'Id',
          type: sql.UniqueIdentifier,
          value: id,
        },
      ])
    ).data[0];

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

    // const updatedAccount = await AccountController.updateOne(id, requestBody);

    const updatedAccount = (
      await executeUsp<PoIAccount>('usp_Account_UpdateOne', [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: id,
        },
        {
          name: 'FirstName',
          type: sql.NVarChar,
          value: requestBody.firstName,
        },
        {
          name: 'LastName',
          type: sql.NVarChar,
          value: requestBody.lastName,
        },
        {
          name: 'Phone',
          type: sql.NVarChar,
          value: requestBody.phone,
        },
        {
          name: 'Birthday',
          type: sql.DateTime2,
          value: requestBody.birthday,
        },
        {
          name: 'AvatarUrl',
          type: sql.NVarChar,
          value: requestBody.avatarUrl,
        },
        {
          name: 'Password',
          type: sql.NVarChar,
          value: requestBody.password,
        },
      ])
    ).data[0];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedAccount,
    });
  });

export default handler;
