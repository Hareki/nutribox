import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { IAccount as IAccountPojo } from 'api/mssql/pojos/account.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<boolean>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  // POST method because we accept something like minhtu1392000+1@gmail.com, the plus symbol is not allowed in the URL.
  const email = req.body.email as string;

  const account = (
    await executeUsp<IAccountPojo>('usp_FetchAccountByEmail', [
      {
        name: 'Email',
        type: sql.NVarChar,
        value: email,
      },
    ])
  ).data[0];

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: account.verified,
  });
  return;
});

export default handler;
