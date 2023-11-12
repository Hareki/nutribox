import paypal from '@paypal/checkout-server-sdk';
import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { PayPalDto } from 'backend/dtos/payPal.dto';
import { PayPalDtoSchema } from 'backend/dtos/payPal.dto';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import { CustomerOrderService } from 'backend/services/customerOrder/customerOrder.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<CustomerOrderModel> | JSFail<string>;

const handler = nc<NextApiRequest, NextApiResponse<SuccessResponse>>(
  DEFAULT_NC_CONFIGS,
);

handler.patch(createValidationGuard(PayPalDtoSchema), async (req, res) => {
  const body = req.body as PayPalDto;
  const onlineTransactionId = body.onlineTransactionId;
  const orderId = body.id;

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  const environment = new paypal.core.SandboxEnvironment(
    clientId,
    clientSecret,
  );
  const paypalClient = new paypal.core.PayPalHttpClient(environment);

  const request = new paypal.orders.OrdersGetRequest(onlineTransactionId);

  const order = await paypalClient.execute(request);
  const orderDetails = order.result;

  if (orderDetails.status !== 'COMPLETED') {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      data: {
        orderId: 'Invalid order id',
      },
    });
  }

  const updatedCustomerOrder = await CustomerOrderService.updatePaidOnlineOrder(
    orderId,
    onlineTransactionId,
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedCustomerOrder,
  });
});

export default handler;
