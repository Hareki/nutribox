import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import SupplierController from 'api/controllers/Supplier.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<ISupplier[]>>>(
  {
    onError: defaultOnError,
    onNoMatch: defaultOnNoMatch,
  },
).get(async (req, res) => {
  await connectToDB();

  const { name } = req.query;

  const suppliers = await SupplierController.getAll({
    filter: {
      name: { $regex: name as string, $options: 'i' },
    },
    limit: AdminMainTablePaginationConstant.docsPerPage,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: suppliers,
  });
});

export default handler;
