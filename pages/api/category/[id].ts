import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import { parsePoIJsonUpeProductWithImages } from 'api/helpers/typeConverter.helper';
import type { PoIJsonUpeProductWithImages } from 'api/mssql/pojos/product.pojo';
import type { PoIPopulatedUpeProductCategory } from 'api/mssql/pojos/product_category.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIPopulatedUpeProductCategory>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const id = req.query.id as string;

  const queryResult = await executeUsp<
    PoIJsonUpeProductWithImages,
    { CategoryName: string }
  >('usp_Products_FetchWithProductOrdersByCategoryId', [
    {
      name: 'CategoryId',
      type: sql.UniqueIdentifier,
      value: id,
    },
    {
      name: 'CategoryName',
      type: sql.NVarChar,
      value: null,
      isOutput: true,
    },
  ]);

  const upeProducts = queryResult.data.map(parsePoIJsonUpeProductWithImages);
  const result: PoIPopulatedUpeProductCategory = {
    id,
    name: queryResult.output.CategoryName,
    products: upeProducts,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
