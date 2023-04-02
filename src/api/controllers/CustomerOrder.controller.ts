import { Types } from 'mongoose';
import type { ClientSession } from 'mongoose';

import type { CheckoutItemsRequestBody } from '../../../pages/api/checkout';

import {
  createOneGenerator,
  getOneGenerator,
  updateOneGenerator,
  getTotalGenerator,
  getAllGenerator,
} from './generator.controller';

import AccountModel from 'api/models/Account.model';
import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { IConsumptionHistory } from 'api/models/CustomerOrder.model/CustomerOrderItem.schema/ConsumptionHistory.schema/types';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import ExpirationModel from 'api/models/Expiration.model';
import type { GetAllDependentPaginationParams } from 'api/types/pagination.type';
import { getNextOrderStatusId } from 'helpers/order.helper';
import { OrderStatus } from 'utils/constants';

export const getOne = getOneGenerator<ICustomerOrder>(CustomerOrderModel());
export const getAll = getAllGenerator<ICustomerOrder>(CustomerOrderModel());

export const getTotal = getTotalGenerator(CustomerOrderModel());

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
    .populate({
      path: 'customerOrders',
      options: {
        sort: {
          createdAt: -1,
          _id: 1,
        },
      },
    })
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

const cancelOrder = async (
  orderId: string,
  session: ClientSession,
): Promise<ICustomerOrder> => {
  // ===================
  const restoreConsumedProducts = async (
    consumptionHistory: IConsumptionHistory[],
    session: ClientSession,
  ): Promise<void> => {
    for (const consumption of consumptionHistory) {
      const expiration = await ExpirationModel()
        .findById(consumption.expiration)
        .session(session)
        .exec();
      if (expiration) {
        expiration.quantity += consumption.quantity;
        await expiration.save({ session });
      }
    }
  };
  // ===================

  const customerOrder = await CustomerOrderModel().findById(orderId).exec();

  const promises = customerOrder.items.map(async (item) => {
    await restoreConsumedProducts(item.consumptionHistory, session);
  });
  await Promise.all(promises);

  customerOrder.status = new Types.ObjectId(OrderStatus.Cancelled.id);
  await customerOrder.save({ session });
  return customerOrder.toObject();
};

const updateOrderStatus = async (orderId: string): Promise<ICustomerOrder> => {
  const customerOrder = await CustomerOrderModel().findById(orderId).exec();
  customerOrder.status = new Types.ObjectId(
    getNextOrderStatusId(customerOrder.status.toString()),
  );

  if (customerOrder.status.toString() === OrderStatus.Delivered.id) {
    customerOrder.deliveredOn = new Date();
  }

  await customerOrder.save();
  return customerOrder.toObject();
};

const getTotalOrdersBelongToAccount = async (
  accountId: string,
): Promise<number> => {
  const total = await CustomerOrderModel()
    .countDocuments({ id: accountId })
    .exec();

  return total;
};

const getOrdersBelongToAccountPaginated = async ({
  id,
  skip,
  limit,
}: GetAllDependentPaginationParams): Promise<ICustomerOrder[]> => {
  const accountWithOrdersPaginated = await AccountModel()
    .findById(id)
    .populate({
      path: 'customerOrders',
      options: {
        sort: {
          createdAt: -1,
          _id: 1,
        },
        skip,
        limit,
      },
    })
    .exec();

  const orders =
    accountWithOrdersPaginated.customerOrders as unknown as ICustomerOrder[];
  return orders;
};

type ProductIdWithTotalSold = {
  _id: Types.ObjectId;
  totalSold: number;
};
const getProductIdsSortedByTotalSoldDesc = async (): Promise<
  ProductIdWithTotalSold[]
> => {
  const aggregationResult = await CustomerOrderModel().aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
      },
    },
    {
      $sort: {
        totalSold: -1,
      },
    },
  ]);
  return aggregationResult;
};

const CustomerOrderController = {
  getOne,
  getAll,
  getProfit,
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus,
  createOne,
  updateOne,
  getTotal,
  getOrdersBelongToAccountPaginated,
  getTotalOrdersBelongToAccount,
  getProductIdsSortedByTotalSoldDesc,
};
export default CustomerOrderController;
