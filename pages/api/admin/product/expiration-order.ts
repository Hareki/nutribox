import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/databaseConnection';
import { processPaginationParams } from 'api/helpers/pagination.helpers';
import ExpirationModel from 'api/models/Expiration.model';
import ProductOrderModel from 'api/models/ProductOrder.model';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type { ISupplier } from 'api/models/Supplier.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

export interface ExpirationOrder {
  supplierName: string;
  importDate: Date | string;
  expirationDate: Date | string;
  importQuantity: number;
  remainingQuantity: number;
}
// FIXME currently no controller calling, directly manipulate models instead => no reusability
// just for the sake of time
const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<ExpirationOrder>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const productId = new Types.ObjectId(req.query.productId as string);
  // const productId = new Types.ObjectId('640990a80009112a7a900b94');

  const getTotalExpirationOrders = async () => {
    const result = await ProductOrderModel()
      .find({ product: productId })
      .countDocuments();
    return result;
  };

  const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
    req,
    getTotalExpirationOrders,
  );

  const productOrders = await ProductOrderModel()
    .find({ product: productId })
    .populate([
      {
        path: 'supplier',
        select: ['name'],
      },
    ])
    .sort({ importDate: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const expirations = await ExpirationModel()
    .find({ product: productId })
    .sort({ importDate: -1, _id: 1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const expirationOrders = productOrders.map((productOrder, index) => {
    const { supplier, importDate, quantity: orderQuantity } = productOrder;

    const { quantity: expirationQuantity, expirationDate } = expirations[index];

    return {
      supplierName: (supplier as unknown as ISupplier).name,
      importDate: new Date(importDate),
      expirationDate,
      importQuantity: orderQuantity,
      remainingQuantity: expirationQuantity,
    };
  });

  const result = {
    docs: expirationOrders,
    totalDocs,
    totalPages,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
