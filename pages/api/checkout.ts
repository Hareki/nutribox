import { StatusCodes } from 'http-status-codes';
import { startSession, Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import AccountController from 'api/controllers/Account.controller';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import ProductController from 'api/controllers/Product.controller';
import connectToDB from 'api/database/databaseConnection';
import type {
  ICustomerOrderItem,
  ICustomerOrderItemInputWithoutConsumption,
} from 'api/models/CustomerOrder.model/CustomerOrderItem.schema/types';
import type {
  ICustomerOrder,
  ICustomerOrderInput,
} from 'api/models/CustomerOrder.model/types';
import type { JSendResponse } from 'api/types/response.type';
import { OrderStatus } from 'utils/constants';

export interface CheckoutItemsRequestBody
  extends Omit<ICustomerOrderItem, 'id' | 'product'> {
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

  const profit = CustomerOrderController.getProfit(checkoutRequestBody.items);
  const status = new Types.ObjectId(OrderStatus.Pending.id);
  const account = new Types.ObjectId(checkoutRequestBody.accountId);
  delete checkoutRequestBody.accountId;

  const itemsWithoutConsumption: ICustomerOrderItemInputWithoutConsumption[] =
    checkoutRequestBody.items.map((item) => {
      return {
        quantity: item.quantity,
        product: new Types.ObjectId(item.productId),
        unitWholesalePrice: item.unitWholesalePrice,
        unitRetailPrice: item.unitRetailPrice,
      };
    });

  const accountId = account._id.toString();
  console.log('file: checkout.ts:60 - accountId:', accountId);
  await connectToDB();
  const session = await startSession();
  session.startTransaction();
  try {
    console.log('1. START CLEAR CART ITEMS');
    await AccountController.clearCartItems(accountId, session);

    console.log('2. START CONSUME PRODUCTS');
    const consumptionHistories = await ProductController.consumeProducts(
      itemsWithoutConsumption,
      session,
    );

    const customerOrderInput: ICustomerOrderInput = {
      ...checkoutRequestBody,
      profit,
      status,
      account,
      items: itemsWithoutConsumption.map((item, index) => ({
        ...item,
        consumptionHistory: consumptionHistories[index],
      })),
    };

    console.log(
      'file: checkout.ts:76 - customerOrderInput:',
      JSON.stringify(customerOrderInput),
    );

    console.log('3. START CREATE CUSTOMER ORDER');
    const customerOrder = await CustomerOrderController.createOne(
      customerOrderInput,
      session,
    );

    // manually add reference, can't do this in middleware because of transaction
    console.log('4. START ADD CUSTOMER ORDER TO ACCOUNT');
    await AccountController.addCustomerOrder(
      accountId,
      customerOrder.id,
      session,
    );

    console.log('5. ALL DONE, ABOUT TO COMMIT TRANSACTION');
    await session.commitTransaction();

    console.log('6. END SESSION');
    await session.endSession();

    console.log('7. SESSION ENDED');

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: customerOrder,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    await session.endSession();
    console.log('X. ERROR OCCURRED');
    console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default handler;
