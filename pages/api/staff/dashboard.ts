import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { DashboardService } from 'backend/services/dashboard/dashboard.service';
import type { ManagerDashboardData } from 'backend/services/dashboard/helper';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<ManagerDashboardData>;
type FailResponse = JSFail<ManagerDashboardData>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.get(async (req, res) => {
  const dashboardData = await DashboardService.getDashboardData();
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: dashboardData,
  });
});

export default handler;
