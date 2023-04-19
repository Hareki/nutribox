import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import { mapJsonUpeToUpe } from 'api/helpers/typeConverter.helper';
import type {
  IJsonUpeProductWithImages,
  IUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<IUpeProductWithImages[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { name } = req.query;
  // const searchName = removeAccents(name as string);

  const result = await executeUsp<IJsonUpeProductWithImages>(
    'usp_FetchUpeProductsByKeyword',
    [
      { name: 'Limit', type: sql.Int, value: 10 },
      { name: 'Keyword', type: sql.NVarChar, value: name },
    ],
  );

  const upeProducts = result.data.map(mapJsonUpeToUpe);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: upeProducts,
  });
});

export default handler;
