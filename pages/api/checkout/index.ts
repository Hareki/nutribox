import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { CheckoutDtoSchema } from 'backend/dtos/checkout.dto';
import { getSessionAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { createValidationGuard } from 'backend/services/common/common.guard';
import {
  createCartItemAccessGuard,
  createCheckoutValidationGuard,
} from 'backend/services/customerOrder/customerOrder.guard';
import { CustomerOrderService } from 'backend/services/customerOrder/customerOrder.service';
import type { JSFail, JSSuccess } from 'backend/types/jsend';
import type { CustomerOrderModel } from 'models/customerOrder.model';

type SuccessResponse = JSSuccess<CustomerOrderModel>;
type FailResponse = JSFail<CustomerOrderModel>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler.post(
  createValidationGuard(CheckoutDtoSchema),
  createCartItemAccessGuard(),
  createCheckoutValidationGuard(),
  async (req, res) => {
    const { checkoutValidation, ...dto } = req.body;
    const account = await getSessionAccount(req, res);

    const customerOrder = await CustomerOrderService.checkout(
      dto,
      account.customer.id,
      checkoutValidation,
    );
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: customerOrder,
    });
  },
);

export default handler;
