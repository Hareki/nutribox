import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { DashboardService } from 'backend/services/dashboard/dashboard.service';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<number[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const year = req.query.year as string;
  const monthlyProfits = await DashboardService.getMonthlyProfits(Number(year));
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: monthlyProfits,
  });
});

export default handler;
