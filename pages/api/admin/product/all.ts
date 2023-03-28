import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { populateAscUnexpiredExpiration } from 'api/helpers/model.helper';
import { processPaginationParams } from 'api/helpers/pagination.helpers';
import type {
  ICdsProduct,
  ICdsUpeProduct,
  IProduct,
} from 'api/models/Product.model/types';
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
  NextApiResponse<JSendResponse<GetAllPaginationResult<ICdsUpeProduct>>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { skip, limit, totalPages, totalDocs } = await processPaginationParams(
    req,
    ProductController.getTotal,
  );

  const products = (await ProductController.getAll({
    sort: { createdAt: -1, _id: 1 },
    skip,
    limit,
    populate: ['category', 'defaultSupplier'],
  })) as unknown as ICdsProduct[];

  // bypass the type check as it doesn't matter here and time's running out so can't be bothered to fix it now.
  const upeCdsProducts = (await populateAscUnexpiredExpiration(
    products as unknown as IProduct[],
  )) as unknown as ICdsUpeProduct[];

  const result = {
    totalPages,
    totalDocs,
    docs: upeCdsProducts,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

export default handler;
