import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import SupplierController from 'api/controllers/Supplier.controller';
import connectToDB from 'api/database/databaseConnection';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type { ISupplierDropdown } from 'api/models/Supplier.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ISupplierDropdown[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const suppliers = await SupplierController.getDropdown();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: suppliers,
  });
});

export default handler;
