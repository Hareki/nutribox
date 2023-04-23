import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { PoISupplierDropdown } from 'api/mssql/pojos/supplier.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoISupplierDropdown[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const supplierDropdown = (
    await executeUsp<PoISupplierDropdown>('usp_Suppliers_FetchDropDown')
  ).data;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: supplierDropdown,
  });
});

export default handler;
