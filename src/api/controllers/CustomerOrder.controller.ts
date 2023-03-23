import type { CheckoutItemsRequestBody } from '../../../pages/api/checkout';

import { createOneGenerator, updateOneGenerator } from './generator.controller';

import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';

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

const CustomerOrderController = {
  getProfit,
  createOne,
  updateOne,
};
export default CustomerOrderController;
