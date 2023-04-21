import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  defaultOnNoMatch,
  onMongooseValidationError,
} from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getAddressParamArray } from 'api/helpers/mssql.helper';
// import type { ISupplierInput } from 'api/models/Supplier.model/types';
// import type { ISupplier } from 'api/models/Supplier.model/types';
import type { ISupplierInput } from 'api/models/Supplier.model/types';
import type { ISupplier as ISupplierPojo } from 'api/mssql/pojos/supplier.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateSupplierInfoRb extends ISupplierInput {}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ISupplierPojo | Record<string, string>>>
>({
  onError: onMongooseValidationError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    // await connectToDB();

    const supplierId = req.query.id as string;

    // const supplier = await SupplierController.getOne({
    //   id: supplierId,
    // });

    const supplier = (
      await executeUsp<ISupplierPojo>('usp_FetchSupplierById', [
        {
          name: 'SupplierId',
          type: sql.UniqueIdentifier,
          value: supplierId,
        },
      ])
    ).data[0];

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: supplier,
    });
  })

  .put(async (req, res) => {
    // await connectToDB();

    const supplierId = req.query.id as string;
    const requestBody = req.body as UpdateSupplierInfoRb;

    // const updatedSupplier = await SupplierController.updateOne(supplierId, requestBody);

    const updatedSupplier = (
      await executeUsp<ISupplierPojo>('usp_UpdateSupplier', [
        {
          name: 'SupplierId',
          type: sql.UniqueIdentifier,
          value: supplierId,
        },
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
      data: updatedSupplier,
    });
  });

export default handler;
