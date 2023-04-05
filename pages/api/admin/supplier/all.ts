import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import SupplierController from 'api/controllers/Supplier.controller';
import connectToDB from 'api/database/databaseConnection';
import { processPaginationParams } from 'api/helpers/pagination.helpers';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<ISupplier>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
    req,
    CustomerOrderController.getTotal,
  );

  const orders = await SupplierController.getAll({
    sort: { createdAt: -1, _id: 1 },
    skip,
    limit,
  });

  const result = {
    totalPages,
    totalDocs,
    docs: orders,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
