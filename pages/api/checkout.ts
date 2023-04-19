import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { ICustomerOrderItemInputWithoutConsumption } from 'api/models/CustomerOrder.model/CustomerOrderItem.schema/types';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface CheckoutItemsRequestBody
  extends Omit<ICustomerOrderItemInputWithoutConsumption, 'id' | 'product'> {
  productId: string;
}
export interface CheckoutRequestBody
  extends Omit<
    ICustomerOrder,
    '_id' | 'id' | 'account' | 'status' | 'createdAt' | 'profit' | 'items'
  > {
  accountId: string;
  items: CheckoutItemsRequestBody[];
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<ICustomerOrder>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).post(async (req, res) => {
  const checkoutRequestBody = req.body as CheckoutRequestBody;
  console.log(
    'file: checkout.ts:43 - checkoutRequestBody:',
    checkoutRequestBody,
  );

  const queryResult = await executeUsp<
    unknown,
    { customer_order_id_output: string }
  >('usp_Checkout', [
    {
      name: 'account_id',
      type: sql.UniqueIdentifier,
      value: checkoutRequestBody.accountId,
    },
    {
      name: 'phone',
      type: sql.NVarChar,
      value: checkoutRequestBody.phone,
    },
    {
      name: 'province_code',
      type: sql.Int,
      value: checkoutRequestBody.provinceId,
    },
    {
      name: 'district_code',
      type: sql.Int,
      value: checkoutRequestBody.districtId,
    },
    {
      name: 'ward_code',
      type: sql.Int,
      value: checkoutRequestBody.wardId,
    },
    {
      name: 'street_address',
      type: sql.NVarChar,
      value: checkoutRequestBody.streetAddress,
    },
    {
      name: 'estimated_distance',
      type: sql.Int,
      value: checkoutRequestBody.estimatedDistance,
    },
    {
      name: 'estimated_delivery_time',
      type: sql.DateTime2,
      value: checkoutRequestBody.estimatedDeliveryTime,
    },
    {
      name: 'note',
      type: sql.NVarChar,
      value: checkoutRequestBody.note,
    },
    {
      name: 'paid',
      type: sql.Bit,
      value: checkoutRequestBody.paid ? 1 : 0,
    },
    {
      name: 'customer_order_id_output',
      type: sql.UniqueIdentifier,
      value: null,
      isOutput: true,
    },
  ]);

  const orderId = queryResult.output.customer_order_id_output;

  // FIXME: WARNING: this ICustomerOrder is not from POJO, this is a FALSE type
  const queryResult2 = await executeUsp<ICustomerOrder>(
    'usp_FetchCustomerOrderById',
    [
      {
        type: sql.UniqueIdentifier,
        name: 'Id',
        value: orderId,
      },
    ],
  );

  const customerOrder = queryResult2.data[0];

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: customerOrder,
  });

  // const profit = CustomerOrderController.getProfit(checkoutRequestBody.items);
  // const status = new Types.ObjectId(OrderStatus.Pending.id);
  // const account = new Types.ObjectId(checkoutRequestBody.accountId);
  // delete checkoutRequestBody.accountId;

  // const itemsWithoutConsumption: ICustomerOrderItemInputWithoutConsumption[] =
  //   checkoutRequestBody.items.map((item) => {
  //     return {
  //       quantity: item.quantity,
  //       unitWholesalePrice: item.unitWholesalePrice,
  //       unitRetailPrice: item.unitRetailPrice,
  //       product: new Types.ObjectId(item.productId),
  //     };
  //   });

  // const accountId = account._id.toString();
  // console.log('file: checkout.ts:60 - accountId:', accountId);
  // await connectToDB();
  // const session = await startSession();
  // session.startTransaction();
  // try {
  //   console.log('1. START CLEAR CART ITEMS');
  //   await AccountController.clearCartItems(accountId, session);

  //   console.log('2. START CONSUME PRODUCTS');
  //   const consumptionHistories = await ProductController.consumeProducts(
  //     itemsWithoutConsumption,
  //     session,
  //   );

  //   const customerOrderInput: ICustomerOrderInput = {
  //     ...checkoutRequestBody,
  //     profit,
  //     status,
  //     account,
  //     items: itemsWithoutConsumption.map((item, index) => ({
  //       ...item,
  //       consumptionHistory: consumptionHistories[index],
  //     })),
  //   };

  //   console.log(
  //     'file: checkout.ts:76 - customerOrderInput:',
  //     JSON.stringify(customerOrderInput),
  //   );

  //   console.log('3. START CREATE CUSTOMER ORDER');
  //   const customerOrder = await CustomerOrderController.createOne(
  //     customerOrderInput,
  //     session,
  //   );

  //   // manually add reference, can't do this in middleware because of transaction
  //   console.log('4. START ADD CUSTOMER ORDER TO ACCOUNT');
  //   await AccountController.addCustomerOrder(
  //     accountId,
  //     customerOrder.id,
  //     session,
  //   );

  //   console.log('5. ALL DONE, ABOUT TO COMMIT TRANSACTION');
  //   await session.commitTransaction();

  //   console.log('6. END SESSION');
  //   await session.endSession();

  //   console.log('7. SESSION ENDED');

  //   res.status(StatusCodes.OK).json({
  //     status: 'success',
  //     data: customerOrder,
  //   });
  // } catch (error) {
  //   if (session.inTransaction()) {
  //     await session.abortTransaction();
  //   }
  //   await session.endSession();
  //   console.log('X. ERROR OCCURRED');
  //   console.log(error);

  //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
  //     status: 'error',
  //     message: error.message,
  //   });
  // }
});

export default handler;
