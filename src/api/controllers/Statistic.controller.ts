import type { StatisticProduct } from '../../../pages/api/admin/dashboard';

import CustomerOrderController from './CustomerOrder.controller';

import {
  getOrderCountAndProfit,
  getOrdersBetweenDates,
  getPreviousMonthRange,
  getThisMonthRange,
  getTodayRange,
} from 'api/helpers/statistic.helper';
import CustomerOrderModel from 'api/models/CustomerOrder.model';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import ExpirationModel from 'api/models/Expiration.model';
import ProductModel from 'api/models/Product.model';
import type { IProductWithTotalQuantity } from 'api/models/Product.model/types';

const getTodayProfit = async () => {
  const { startOfDay, startOfTomorrow } = getTodayRange();
  const orders = await getOrdersBetweenDates(startOfDay, startOfTomorrow);
  const { totalProfit } = getOrderCountAndProfit(orders);
  return totalProfit;
};

const getTodayOrderNumber = async () => {
  const { startOfDay, startOfTomorrow } = getTodayRange();
  const orders = await getOrdersBetweenDates(startOfDay, startOfTomorrow);
  const { orderCount } = getOrderCountAndProfit(orders);
  return orderCount;
};

const getPreviousMonthProfit = async () => {
  const { firstDayOfPrevMonth, currentDayOfPrevMonth } =
    getPreviousMonthRange();
  const orders = await getOrdersBetweenDates(
    firstDayOfPrevMonth,
    currentDayOfPrevMonth,
  );
  const { totalProfit } = getOrderCountAndProfit(orders);
  return totalProfit;
};

const getPreviousMonthOrderNumber = async () => {
  const { firstDayOfPrevMonth, currentDayOfPrevMonth } =
    getPreviousMonthRange();
  const orders = await getOrdersBetweenDates(
    firstDayOfPrevMonth,
    currentDayOfPrevMonth,
  );
  const { orderCount } = getOrderCountAndProfit(orders);
  return orderCount;
};

const getThisMonthProfit = async () => {
  const { firstDayOfMonth, firstDayOfNextMonth } = getThisMonthRange();
  const orders = await getOrdersBetweenDates(
    firstDayOfMonth,
    firstDayOfNextMonth,
  );
  const { totalProfit } = getOrderCountAndProfit(orders);
  return totalProfit;
};

const getThisMonthOrderNumber = async () => {
  const { firstDayOfMonth, firstDayOfNextMonth } = getThisMonthRange();
  const orders = await getOrdersBetweenDates(
    firstDayOfMonth,
    firstDayOfNextMonth,
  );
  const { orderCount } = getOrderCountAndProfit(orders);
  return orderCount;
};

const getFiveMostRecentOrders = async (): Promise<ICustomerOrder[]> => {
  const limit = 5;
  const orders = await CustomerOrderModel()
    .find()
    .populate({
      path: 'account',
      select: 'fullName firstName lastName',
    })
    .sort({ createdAt: -1, _id: 1 })
    .exec();

  return orders.slice(0, limit);
};

const getFiveProductsWithLeastTotalQuantity = async (): Promise<
  IProductWithTotalQuantity[]
> => {
  const limit = 5;
  const currentDate = new Date();

  // Find all non-expired Expiration documents, 0 quantity Expiration documents are included
  const nonExpiredExpirations = await ExpirationModel().aggregate([
    {
      $match: {
        expirationDate: { $gte: currentDate },
      },
    },
    {
      $group: {
        _id: '$product',
        totalQuantity: { $sum: '$quantity' },
      },
    },
  ]);

  // Get the product IDs from the nonExpiredExpirations array
  const productIds = nonExpiredExpirations.map((expiration) => expiration._id);

  // Find the almost or already out-of-stock products using the product IDs
  const products = await ProductModel()
    .find({
      _id: { $in: productIds },
    })
    .populate({
      path: 'category',
      select: 'name',
    })
    .exec();

  // Map products to add totalQuantity
  const almostOutOfStockProducts: IProductWithTotalQuantity[] = products.map(
    (product) => {
      const productWithTotalQuantity: IProductWithTotalQuantity =
        product.toObject();

      const expiration = nonExpiredExpirations.find(
        (e) => e._id.toString() === product.id,
      );

      productWithTotalQuantity.totalQuantity = expiration
        ? expiration.totalQuantity
        : 0;
      return productWithTotalQuantity;
    },
  );

  // Find the products with no expiration document or only have expired expiration document and set their totalQuantity to 0
  const productsWithNoExpirations = await ProductModel()
    .find({
      _id: { $nin: productIds },
    })
    .populate({
      path: 'category',
      select: 'name',
    })
    .exec();

  const productsWithNoExpirationsWithTotalQuantity: IProductWithTotalQuantity[] =
    productsWithNoExpirations.map((product) => {
      const productWithTotalQuantity: IProductWithTotalQuantity =
        product.toObject();
      productWithTotalQuantity.totalQuantity = 0;
      return productWithTotalQuantity;
    });

  // Combine the arrays and sort by totalQuantity
  const allProducts = [
    ...almostOutOfStockProducts,
    ...productsWithNoExpirationsWithTotalQuantity,
  ].sort((a, b) => a.totalQuantity - b.totalQuantity);

  // Return the top 5 (or custom limit) almost or already out-of-stock products
  return allProducts.slice(0, limit);
};

const getMostAndLeastSoldProducts = async (): Promise<{
  mostSoldProducts: StatisticProduct[];
  leastSoldProducts: StatisticProduct[];
}> => {
  const aggregationResult =
    await CustomerOrderController.getProductIdsSortedByTotalSoldDesc();

  const totalSoldOfAllProducts = aggregationResult.reduce(
    (acc, item) => acc + item.totalSold,
    0,
  );
  const maxTotalSold = aggregationResult[0].totalSold;
  const minTotalSold =
    aggregationResult[aggregationResult.length - 1].totalSold;

  const mostSoldProducts = [];
  const leastSoldProducts = [];

  for (const result of aggregationResult) {
    const productDetails = await ProductModel().findById(result._id);

    if (result.totalSold === maxTotalSold) {
      mostSoldProducts.push({
        product: productDetails,
        totalSold: result.totalSold,
        totalSoldOfAllProducts,
      });
    } else if (result.totalSold === minTotalSold) {
      leastSoldProducts.push({
        product: productDetails,
        totalSold: result.totalSold,
        totalSoldOfAllProducts,
      });
    }
  }

  return {
    mostSoldProducts,
    leastSoldProducts,
  };
};

async function getMonthlyProfits(): Promise<number[]> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyProfits = new Array(12).fill(0);

  for (let month = 0; month <= currentMonth; month++) {
    const firstDayOfMonth = new Date(currentYear, month, 1);
    const firstDayOfNextMonth = new Date(currentYear, month + 1, 1);

    const orders = await CustomerOrderModel().find({
      createdAt: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth,
      },
    });

    const monthlyTotalProfit = orders.reduce(
      (accumulator, order) => accumulator + order.profit,
      0,
    );

    monthlyProfits[month] = monthlyTotalProfit;
  }

  return monthlyProfits;
}

const StatisticController = {
  getTodayProfit,
  getTodayOrderNumber,
  getPreviousMonthProfit,
  getPreviousMonthOrderNumber,
  getThisMonthProfit,
  getThisMonthOrderNumber,
  getFiveMostRecentOrders,
  getFiveProductsWithLeastTotalQuantity,
  getMostAndLeastSoldProducts,
  getMonthlyProfits,
};
export default StatisticController;
