import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import SupplierController from 'api/controllers/Supplier.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendSuccessResponse,
} from 'api/types/response.type';

export interface CreateSupplierRb
  extends Omit<ISupplier, 'id' | 'productOrders'> {}

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    | JSendSuccessResponse<ISupplier>
    | JSendFailResponse<Record<string, string>>
    | JSendErrorResponse
  >
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as CreateSupplierRb;

  const supplier = await SupplierController.createOne(requestBody);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: supplier,
  });
});

export default handler;
