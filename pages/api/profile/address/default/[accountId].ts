import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import type { IAccountAddress as IAccountAddressPojo } from 'api/mssql/pojos/account_address.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface SetDefaultAddressRequestBody {
  id: string;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IAccountAddressPojo[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();
  const requestBody = req.body as SetDefaultAddressRequestBody;
  const accountId = req.query.accountId as string;
  const accountAddressId = requestBody.id;

  const updatedAddresses = (
    await executeUsp<IAccountAddressPojo>(
      'usp_AccountAddresses_UpdateDefault',
      [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
        {
          name: 'Id',
          type: sql.UniqueIdentifier,
          value: accountAddressId,
        },
      ],
    )
  ).data;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedAddresses,
  });
});

export default handler;
