import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CustomerService } from 'backend/services/customer/customer.service';
import type { CustomerDashboardData } from 'backend/services/customer/helper';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<CustomerDashboardData>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const id = req.query.id as string;
  const data = await CustomerService.getDashboardInfo(id || '');

  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
