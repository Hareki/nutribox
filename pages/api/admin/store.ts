import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp, getAddressParamArray } from 'api/helpers/mssql.helper';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
// import type { IStore } from 'api/models/Store.model/types';
import type { IStore } from 'api/models/Store.model/types';
import type { PoIStore } from 'api/mssql/pojos/store.pojo';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<NextApiRequest, NextApiResponse<JSendResponse<PoIStore>>>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).put(async (req, res) => {
  // await connectToDB();

  const requestBody = req.body as UpdateStoreInfoRb;
  // const result = await StoreController.updateOne(requestBody.id, requestBody);

  let updatedStore: PoIStore;
  if (isUpdateStoreHoursRb(requestBody)) {
    console.log('not yet implemented');
  } else {
    updatedStore = (
      await executeUsp<PoIStore>('usp_UpdateStore', [
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
  }

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
