import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import connectToDB from 'api/database/databaseConnection';
import { processPaginationParams } from 'api/helpers/pagination.helpers';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<ICustomerOrder>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
    req,
    CustomerOrderController.getTotal,
  );

  const orders = await CustomerOrderController.getAll({
    sort: { createdAt: -1 },
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
