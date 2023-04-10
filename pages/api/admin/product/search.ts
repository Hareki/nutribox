import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import { populateAscUnexpiredExpiration } from 'api/helpers/model.helper';
import type {
  ICdsProduct,
  ICdsUpeProduct,
  IProduct,
} from 'api/models/Product.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICdsUpeProduct[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { name } = req.query;

  const products = (await ProductController.getAll({
    filter: {
      name: { $regex: name as string, $options: 'i' },
    },
    sort: { createdAt: -1, _id: 1 },
    limit: AdminMainTablePaginationConstant.docsPerPage,
    populate: ['category', 'defaultSupplier'],
  })) as unknown as ICdsProduct[];

  const upeCdsProducts = (await populateAscUnexpiredExpiration(
    products as unknown as IProduct[],
  )) as unknown as ICdsUpeProduct[];

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: upeCdsProducts,
  });
});

export default handler;
