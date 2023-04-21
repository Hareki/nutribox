import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { IJsonPopulatedCartItem } from 'api/mssql/pojos/cart_item.pojo';
import type {
  JSendErrorResponse,
  JSendFailResponse,
  JSendResponse,
} from 'api/types/response.type';
import type { CartState2 } from 'hooks/global-states/useCart';

export interface CartItemRequestBody {
  productId: string;
  quantity: number;
}

// const onCartItemError: ErrorHandler<
//   NextApiRequest,
//   NextApiResponse<JSendFailResponse<string> | JSendErrorResponse>
// > = (err: CustomError, _req, res) => {
//   console.log(JSON.stringify(err));

//   if (err.code) {
//     res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
//       status: 'fail',
//       data: err.message,
//     });
//     return;
//   }

//   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//     status: 'error',
//     message: err.message,
//   });
// };

const handler = nc<
  NextApiRequest,
  NextApiResponse<
    // | JSendResponse<CartState2 | IPopulatedCartItemsAccount>
    | JSendResponse<CartState2 | string>
    | JSendFailResponse<string>
    | JSendErrorResponse
  >
>({
  attachParams: true,
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
})
  .get(async (req, res) => {
    const accountId = req.query.accountId as string;

    const queryResult = await executeUsp<IJsonPopulatedCartItem>( //
      'usp_CartItems_FetchPopulatedByAccountId',
      [
        {
          name: 'AccountId',
          type: sql.UniqueIdentifier,
          value: accountId,
        },
      ],
    );

    const cartState: CartState2 = {
      cart: queryResult.data.map((item) => ({
        ...item,
        product_id: JSON.parse(item.product_id),
      })),
    };

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: cartState,
    });
  })
  .put(async (req, res) => {
    const requestBody = req.body as CartItemRequestBody;
    const accountId = req.query.accountId as string;

    await executeUsp('usp_CartItem_CreateUpdateDeleteOne', [
      {
        name: 'AccountId',
        type: sql.UniqueIdentifier,
        value: accountId,
      },
      {
        name: 'ProductId',
        type: sql.UniqueIdentifier,
        value: requestBody.productId,
      },
      {
        name: 'Quantity',
        type: sql.Int,
        value: requestBody.quantity,
      },
    ]);

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: 'success',
    });
  });

export default handler;
