import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CustomerOrderService } from 'backend/services/customerOrder/customerOrder.service';
import type { CheckoutValidation } from 'backend/services/customerOrder/helper';
import type { JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<CheckoutValidation>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.get(async (req, res) => {
  const customerAddress = req.query.address as string;

  const checkoutValidation =
    await CustomerOrderService.getCheckoutValidation(customerAddress);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: checkoutValidation,
  });
});

export default handler;
