import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
// import type { ISupplier } from 'api/models/Supplier.model/types';
import { fetchAdminSearchData } from 'api/helpers/mssql.helper';
import type { PoISupplier } from 'api/mssql/pojos/supplier.pojo';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoISupplier[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { name } = req.query;

  const suppliers = await fetchAdminSearchData<PoISupplier>({
    keyword: name as string,
    procedureName: 'usp_Suppliers_FetchByNameKeyword',
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: suppliers,
  });
});

export default handler;
