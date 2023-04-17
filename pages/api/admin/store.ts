import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import StoreController from 'api/controllers/Store.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<IStore>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  await connectToDB();

  const requestBody = req.body as UpdateStoreInfoRb;
  const result = await StoreController.updateOne(requestBody.id, requestBody);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
