import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import {
  extractPaginationOutputFromReq,
  fetchAdminPaginationData,
} from 'api/helpers/mssql.helper';
import type { PoiProductOrderWithSupplierName } from 'api/mssql/pojos/product_order.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

export interface ExpirationOrder {
  supplierName: string;
  importDate: Date | string;
  expirationDate: Date | string;
  importQuantity: number;
  remainingQuantity: number;
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<ExpirationOrder>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const productId = req.query.productId as string;

  const { pageSize, pageNumber } = extractPaginationOutputFromReq(req);

  const queryResult =
    await fetchAdminPaginationData<PoiProductOrderWithSupplierName>(
      {
        procedureName: 'usp_ProductOrders_FetchByPageAndProductId',
        pageNumber,
        pageSize,
      },
      [
        {
          name: 'ProductId',
          type: sql.UniqueIdentifier,
          value: productId,
        },
      ],
    );

  const result = {
    totalDocs: queryResult.totalDocs,
    totalPages: queryResult.totalPages,
    docs: queryResult.docs.map((doc) => ({
      supplierName: doc.supplier_name,
      importDate: doc.import_date,
      expirationDate: doc.expiration_date,
      importQuantity: doc.import_quantity,
      remainingQuantity: doc.remaining_quantity,
    })),
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
