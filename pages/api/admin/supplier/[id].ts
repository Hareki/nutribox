import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import SupplierController from 'api/controllers/Supplier.controller';
import connectToDB from 'api/database/databaseConnection';
import type { ISupplierInput } from 'api/models/Supplier.model/types';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateSupplierInfoRb extends ISupplierInput {}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ISupplier | Record<string, string>>>
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;

    const supplier = await SupplierController.getOne({
      id,
    });

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: supplier,
    });
  })

  .put(async (req, res) => {
    await connectToDB();

    const id = req.query.id as string;
    const requestBody = req.body as UpdateSupplierInfoRb;
    const updatedSupplier = await SupplierController.updateOne(id, requestBody);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: updatedSupplier,
    });
  });

export default handler;
