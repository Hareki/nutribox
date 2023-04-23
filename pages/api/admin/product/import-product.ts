import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getProduct } from 'api/base/server-side-modules/mssql-modules';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { PoIUpeProductWithImages } from 'api/mssql/pojos/product.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface ImportProductRb {
  productId: string;
  supplierId: string;
  quantity: number;
  importDate: string;
  unitWholesalePrice: number;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIUpeProductWithImages>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as ImportProductRb;
  const importDate = new Date(requestBody.importDate);

  await executeUsp('usp_ProductOrder_ImportProduct', [
    {
      name: 'ProductId',
      type: sql.UniqueIdentifier,
      value: requestBody.productId,
    },
    {
      name: 'SupplierId',
      type: sql.UniqueIdentifier,
      value: requestBody.supplierId,
    },
    {
      name: 'Quantity',
      type: sql.Int,
      value: requestBody.quantity,
    },
    {
      name: 'ImportDate',
      type: sql.DateTime,
      value: importDate,
    },
    {
      name: 'UnitImportPrice',
      type: sql.Int,
      value: requestBody.unitWholesalePrice,
    },
  ]);

  const product = await getProduct(requestBody.productId);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: product,
  });
});

export default handler;
