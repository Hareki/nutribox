import { Types } from 'mongoose';

import type { CheckoutItemsRequestBody } from '../../../pages/api/checkout';

import {
  createOneGenerator,
  getOneGenerator,
  updateOneGenerator,
} from './generator.controller';

import AccountModel from 'api/models/Account.model';
import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { OrderStatus } from 'utils/constants';

export const getOne = getOneGenerator<ICustomerOrder>(CustomerOrderModel());

const createOne = createOneGenerator<ICustomerOrder>(CustomerOrderModel());
const updateOne = updateOneGenerator<ICustomerOrder>(CustomerOrderModel());

const getProfit = (items: CheckoutItemsRequestBody[]): number => {
  let totalProfit = 0;

  for (const item of items) {
    const profitPerItem = item.unitRetailPrice - item.unitWholesalePrice;
    const totalProfitForItem = profitPerItem * item.quantity;
    totalProfit += totalProfitForItem;
  }

  return totalProfit;
};

const getOrders = async (accountId: string): Promise<ICustomerOrder[]> => {
  const accountDoc = await AccountModel()
    .findById(accountId)
    .populate('customerOrders')
    .lean({ virtuals: true })
    .exec();

  return accountDoc.customerOrders as unknown as ICustomerOrder[];
};

const getOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const customerOrder = await getOne({
    id: orderId,
  });
  return customerOrder;
};

const cancelOrder = async (orderId: string): Promise<ICustomerOrder> => {
  const customerOrder = await CustomerOrderModel().findById(orderId).exec();
  customerOrder.status = new Types.ObjectId(OrderStatus.Cancelled.id);
  await customerOrder.save();
  return customerOrder.toObject();
};

const CustomerOrderController = {
  getOne,
  getProfit,
  getOrders,
  getOrder,
  cancelOrder,
  createOne,
  updateOne,
};
export default CustomerOrderController;
