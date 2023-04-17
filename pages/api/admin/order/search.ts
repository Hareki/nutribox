import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import connectToDB from 'api/database/mongoose/databaseConnection';
import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { AdminMainTablePaginationConstant } from 'utils/constants';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrder[]>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { id } = req.query;

  const filter = [
    {
      $addFields: {
        id: { $toString: '$_id' },
      },
    },
    {
      $match: {
        id: { $regex: id, $options: 'i' },
      },
    },
    {
      $sort: { createdAt: -1, _id: 1 } as Record<string, 1 | -1>,
    },
    {
      $limit: AdminMainTablePaginationConstant.docsPerPage,
    },
  ];

  const orders = await CustomerOrderModel().aggregate(filter).exec();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: orders,
  });
});

export default handler;
