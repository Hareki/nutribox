import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import connectToDB from 'api/database/databaseConnection';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import type { JSendResponse } from 'api/types/response.type';

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<GetAllPaginationResult<ICustomerOrder>>>
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const { docsPerPage, page } = req.query;
  const accountId = req.query.accountId as string;

  const totalDocs = await CustomerOrderController.getTotal();

  const { skip, limit, totalPages } = getPaginationParams({
    docsPerPage: docsPerPage as string,
    page: page as string,
    totalDocs,
  });

  const orders =
    await CustomerOrderController.getOrdersBelongToAccountPaginated({
      id: accountId,
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
