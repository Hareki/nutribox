import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CustomerOrderService } from 'backend/services/customerOrder/customerOrder.service';
import type { ExportOrderDetails } from 'backend/services/customerOrder/helper';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<ExportOrderDetails[]>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const customerOrderId = req.query.id as string;
  const data =
    await CustomerOrderService.getExportOrderDetails(customerOrderId);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
