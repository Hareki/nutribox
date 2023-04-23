import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type {
  PoIStoreWithJsonStoreHours,
  PoIStoreWithStoreHours,
} from 'api/mssql/pojos/store.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIStoreWithStoreHours>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const id = req.query.id as string;

  const queryResult = await executeUsp<PoIStoreWithJsonStoreHours>(
    'usp_Store_FetchWithStoreHoursById',
    [
      {
        name: 'StoreId',
        type: sql.UniqueIdentifier,
        value: id,
      },
    ],
  );

  const result: PoIStoreWithStoreHours = {
    ...queryResult.data[0],
    store_hours: JSON.parse(queryResult.data[0].store_hours),
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
