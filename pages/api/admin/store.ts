import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { getStore } from 'api/base/server-side-modules/mssql-modules';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getAddressParamArray } from 'api/helpers/mssql.helper';
// FIXME Might have to change the front end, no idea why I did this (using IStoreHourWithObjectId) before
// import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
// import type { IStore } from 'api/models/Store.model/types';
import type { IStoreHour } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type { PoIStore } from 'api/mssql/pojos/store.pojo';
import type { PoIStoreWithStoreHours } from 'api/mssql/pojos/store.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHour[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<PoIStoreWithStoreHours>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  // await connectToDB();

  const requestBody = req.body as UpdateStoreInfoRb;
  // const result = await StoreController.updateOne(requestBody.id, requestBody);

  if (isUpdateStoreHoursRb(requestBody)) {
    const promises = requestBody.storeHours.map(async (storeHour) => {
      console.log('-------------', storeHour.openTime, storeHour.closeTime);
      return await executeUsp('usp_StoreHour_UpdateOne', [
        {
          name: 'StoreId',
          type: sql.UniqueIdentifier,
          value: requestBody.id,
        },
        {
          name: 'StoreHourId',
          type: sql.UniqueIdentifier,
          value: storeHour.id,
        },
        {
          name: 'OpenTime',
          type: sql.Time,
          value: new Date(storeHour.openTime),
        },
        {
          name: 'CloseTime',
          type: sql.Time,
          value: new Date(storeHour.closeTime),
        },
      ]);
    });

    await Promise.all(promises);
  } else {
    await executeUsp<PoIStore>('usp_Store_UpdateContactInfo', [
      {
        name: 'StoreId',
        type: sql.UniqueIdentifier,
        value: requestBody.id,
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
    ]);
  }

  const updatedStore = await getStore(requestBody.id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedStore,
  });
});

export default handler;

function isUpdateStoreHoursRb(
  obj: UpdateStoreInfoRb,
): obj is UpdateStoreHoursRb {
  return (obj as UpdateStoreHoursRb).storeHours !== undefined;
}
