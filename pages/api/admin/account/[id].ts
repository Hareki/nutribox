import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { IAccount } from 'api/models/Account.model/types';
import type { PoIAccount } from 'api/mssql/pojos/account.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<PoIAccount>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
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
});

export default handler;
