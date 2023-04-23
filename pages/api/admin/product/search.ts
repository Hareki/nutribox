import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { fetchAdminSearchData } from 'api/helpers/mssql.helper';
import { parsePoIJsonCdsUpeProductWithImages } from 'api/helpers/typeConverter.helper';
import type {
  PoICdsUpeProductWithImages,
  PoIJsonCdsUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoICdsUpeProductWithImages[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { name } = req.query;

  const jsonProducts =
    await fetchAdminSearchData<PoIJsonCdsUpeProductWithImages>({
      keyword: name as string,
      procedureName: 'usp_Accounts_FetchWithTotalOrdersByFullNameKeyword',
    });

  const productsResult: PoICdsUpeProductWithImages[] = jsonProducts.map(
    parsePoIJsonCdsUpeProductWithImages,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: productsResult,
  });
});

export default handler;
