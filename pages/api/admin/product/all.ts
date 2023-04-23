import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import {
  extractPaginationOutputFromReq,
  fetchAdminPaginationData,
} from 'api/helpers/mssql.helper';
import { parsePoIJsonCdsUpeProductWithImages } from 'api/helpers/typeConverter.helper';
import type { IStoreHourWithObjectId } from 'api/models/Store.model/StoreHour.schema/types';
import type { IStore } from 'api/models/Store.model/types';
import type {
  PoICdsUpeProductWithImages,
  PoIJsonCdsUpeProductWithImages,
} from 'api/mssql/pojos/product.pojo';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

export interface UpdateStoreContactInfoRb extends Omit<IStore, 'storeHours'> {}
export interface UpdateStoreHoursRb extends Pick<IStore, 'id'> {
  storeHours: IStoreHourWithObjectId[];
}
export type UpdateStoreInfoRb = UpdateStoreContactInfoRb | UpdateStoreHoursRb;

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    JSendResponse<GetAllPaginationResult<PoICdsUpeProductWithImages>>
  >
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const { pageSize, pageNumber } = extractPaginationOutputFromReq(req);

  const paginationDataResult =
    await fetchAdminPaginationData<PoIJsonCdsUpeProductWithImages>({
      procedureName: 'usp_Products_FetchCdsUpeWithImagesByPage',
      pageNumber,
      pageSize,
    });

  // Parse fields that are JSON stringified
  const productsResult: PoICdsUpeProductWithImages[] =
    paginationDataResult.docs.map(parsePoIJsonCdsUpeProductWithImages);

  const result: GetAllPaginationResult<PoICdsUpeProductWithImages> = {
    ...paginationDataResult,
    docs: productsResult,
  };
  // ----------------------------

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
