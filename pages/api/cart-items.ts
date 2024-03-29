import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import type { CartItemDto } from 'backend/dtos/cartItem.dto';
import { CartItemDtoSchema } from 'backend/dtos/cartItem.dto';
import { getSessionCustomerAccount } from 'backend/helpers/auth2.helper';
import { DEFAULT_NC_CONFIGS } from 'backend/next-connect/configs';
import { CartItemService } from 'backend/services/cartItem/cartItem.service';
import { createValidationGuard } from 'backend/services/common/common.guard';
import type { CommonCartItem } from 'backend/services/product/helper';
import type { JSFail, JSSuccess } from 'backend/types/jsend';

type SuccessResponse = JSSuccess<CommonCartItem[]>;
type FailResponse = JSFail<CommonCartItem[]>;

const handler = nc<
  NextApiRequest,
  NextApiResponse<SuccessResponse | FailResponse>
>(DEFAULT_NC_CONFIGS);

handler
  .get(async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);
    const cartItems = await CartItemService.getCartItems(account.customer.id);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: cartItems,
    });
  })
  .post(createValidationGuard(CartItemDtoSchema), async (req, res) => {
    const account = await getSessionCustomerAccount(req, res);
    const { product: productId, quantity } = req.body as CartItemDto;

    const updatedCartItems = await CartItemService.updateCartItem(
      account.customer.id,
      productId,
      quantity,
    );
    res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: updatedCartItems,
    });
  });

export default handler;
