import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ErrorHandler } from 'next-connect';
import nc from 'next-connect';

import { defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';
import type { CustomError } from 'api/helpers/error.helper';
import type { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendResponse,
} from 'api/types/response.type';
import type { CartState } from 'hooks/global-states/useCart';

export interface CartItemRequestBody {
  productId: string;
  quantity: number;
}

const onCartItemError: ErrorHandler<
  NextApiRequest,
  NextApiResponse<JSendFailResponse<string> | JSendErrorResponse>
> = (err: CustomError, _req, res) => {
  console.log(JSON.stringify(err));

  if (err.code) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      data: err.message,
    });
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
  });
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    | JSendResponse<CartState | IPopulatedCartItemsAccount>
    | JSendFailResponse<string>
    | JSendErrorResponse
  >
>({
  attachParams: true,
  onError: onCartItemError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    await connectToDB();
    const accountId = req.query.accountId as string;

    const cartState = await AccountController.getCartItems(accountId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: cartState,
    });
  })
  .put(async (req, res) => {
    await connectToDB();
    const requestBody = req.body as CartItemRequestBody;
    const accountId = req.query.accountId as string;

    const account = await AccountController.updateCartItem(
      accountId,
      requestBody,
    );

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: account,
    });
  });

export default handler;
