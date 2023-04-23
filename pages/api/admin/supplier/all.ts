import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
// import type { ISupplier } from 'api/models/Supplier.model/types';
import {
  extractPaginationOutputFromReq,
  fetchAdminPaginationData,
} from 'api/helpers/mssql.helper';
import type { PoISupplier } from 'api/mssql/pojos/supplier.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<PoISupplier>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { pageSize, pageNumber } = extractPaginationOutputFromReq(req);

  const result = await fetchAdminPaginationData<PoISupplier>({
    procedureName: 'usp_Suppliers_FetchByPage',
    pageNumber,
    pageSize,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
