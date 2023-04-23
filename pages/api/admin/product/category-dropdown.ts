import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { PoIProductCategory } from 'api/mssql/pojos/product_category.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIProductCategory[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const categoryDropdown = (
    await executeUsp<PoIProductCategory>('usp_ProductCategories_FetchAll')
  ).data;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: categoryDropdown,
  });
});

export default handler;
