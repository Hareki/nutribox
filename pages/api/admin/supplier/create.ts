import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
// import type { ISupplier } from 'api/models/Supplier.model/types';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getAddressParamArray } from 'api/helpers/mssql.helper';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { PoISupplier } from 'api/mssql/pojos/supplier.pojo';
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
    | JSendSuccessResponse<PoISupplier>
    | JSendFailResponse<Record<string, string>>
    | JSendErrorResponse
  >
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as CreateSupplierRb;

  // const supplier = await SupplierController.createOne(requestBody);

  const newSupplier = (
    await executeUsp<PoISupplier>('usp_Supplier_CreateOne', [
      {
        name: 'Name',
        type: sql.NVarChar,
        value: requestBody.name,
      },
      {
        name: 'Phone',
        type: sql.NVarChar,
        value: requestBody.phone,
      },
      {
        name: 'Email',
        type: sql.NVarChar,
        value: requestBody.email,
      },
      ...getAddressParamArray(requestBody),
    ])
  ).data[0];

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: newSupplier,
  });
});

export default handler;
