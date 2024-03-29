import {
  eachMonthOfInterval,
  endOfYear,
  getMonth,
  isFuture,
  setDate,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns';
import { Between, MoreThan, MoreThanOrEqual } from 'typeorm';

import { CommonService } from '../common/common.service';

import type {
  ManagerDashboardData,
  FinancialStatistic,
  ProductModelWithStock,
  StatisticProduct,
} from './helper';

import { CustomerOrderEntity } from 'backend/entities/customerOrder.entity';
import { CustomerOrderItemEntity } from 'backend/entities/customerOrderItem.entity';
import { ImportOrderEntity } from 'backend/entities/importOrder.entity';
import { ProductEntity } from 'backend/entities/product.entity';
import { OrderStatus } from 'backend/enums/entities.enum';
import { getRepo } from 'backend/helpers/database.helper';
import type { ProductModel } from 'models/product.model';

export class DashboardService {
  public static async getFinancialStatistic(
    type: 'today' | 'thisMonth',
  ): Promise<FinancialStatistic> {
    const customerOrderRepository = await getRepo(CustomerOrderEntity);

    // Define the date based on the 'type'
    const currentDate = new Date();
    const startDate =
      type === 'today' ? startOfDay(currentDate) : startOfMonth(currentDate);

    // Fetch the orders within the specified date with 'SHIPPED' status
    const orders = await customerOrderRepository.find({
      where: {
        updatedAt:
          type === 'today' ? MoreThan(startDate) : MoreThanOrEqual(startDate),
        status: OrderStatus.SHIPPED,
      },
    });

    // Calculate the total profit and order number
    let profit = 0;
    let orderNumber = 0;
    orders.forEach((order) => {
      profit += Number(order.profit);
      orderNumber++;
    });

    return { profit, orderNumber };
  }

  public static async getPrevMonthFinancialStatistic(): Promise<FinancialStatistic> {
    const customerOrderRepository = await getRepo(CustomerOrderEntity);

    // Get the first day of the previous month
    const startDate = startOfMonth(subMonths(new Date(), 1));

    // Get the day of the previous month equivalent to the current day of this month
    const endDate = setDate(subMonths(new Date(), 1), new Date().getDate());

    // Fetch the orders within the specified date range with 'SHIPPED' status
    const orders = await customerOrderRepository.find({
      where: {
        updatedAt: Between(startDate, endDate),
        status: OrderStatus.SHIPPED,
      },
    });

    // Calculate the total profit and order number
    let profit = 0;
    let orderNumber = 0;
    orders.forEach((order) => {
      profit += Number(order.profit);
      orderNumber += 1;
    });

    return { profit, orderNumber };
  }

  // public static async getStatisticProducts(
  //   type: 'leastSold' | 'mostSold',
  // ): Promise<StatisticProduct[]> {
  //   const customerOrderItemRepository = await getRepo(CustomerOrderItemEntity);

  //   // Get the sum of quantity for each product
  //   const results = await customerOrderItemRepository
  //     .createQueryBuilder('orderItem')
  //     .select('orderItem.product', 'productId')
  //     .addSelect('SUM(orderItem.quantity)', 'totalSold')
  //     .groupBy('orderItem.product')
  //     .orderBy('SUM(orderItem.quantity)', type === 'mostSold' ? 'DESC' : 'ASC')
  //     .getRawMany();

  //   // Get the total sold of all products
  //   const totalSoldOfAllProducts = results.reduce(
  //     (acc, curr) => acc + Number(curr.totalSold),
  //     0,
  //   );

  //   // Map results to StatisticProduct format
  //   const statistics = results.map(async (result) => {
  //     const product = (await CommonService.getRecord({
  //       entity: ProductEntity,
  //       filter: { id: result.productId },
  //     })) as ProductModel;
  //     return {
  //       product,
  //       totalSold: Number(result.totalSold),
  //       totalSoldOfAllProducts,
  //     };
  //   });

  //   return Promise.all(statistics);
  // }

  public static async getStatisticProducts(
    type: 'leastSold' | 'mostSold',
  ): Promise<StatisticProduct[]> {
    const customerOrderItemRepository = await getRepo(CustomerOrderItemEntity);

    // Determine the target totalSold value (either mostSold or leastSold)
    const targetTotalSoldValue = await customerOrderItemRepository
      .createQueryBuilder('orderItem')
      .select('SUM(orderItem.quantity)', 'totalSold')
      .groupBy('orderItem.product')
      .orderBy('SUM(orderItem.quantity)', type === 'mostSold' ? 'DESC' : 'ASC')
      .limit(1)
      .getRawOne();

    // Get products with the same totalSold as the target value
    const results = await customerOrderItemRepository
      .createQueryBuilder('orderItem')
      .select('orderItem.product', 'productId')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .groupBy('orderItem.product')
      .having('SUM(orderItem.quantity) = :targetTotalSold', {
        targetTotalSold: targetTotalSoldValue.totalSold,
      })
      .getRawMany();

    // Get the total sold of all products
    const totalSoldOfAllProducts = results.reduce(
      (acc, curr) => acc + Number(curr.totalSold),
      0,
    );

    // Map results to StatisticProduct format
    const statistics = results.map(async (result) => {
      const product = (await CommonService.getRecord({
        entity: ProductEntity,
        filter: { id: result.productId },
      })) as ProductModel;
      return {
        product,
        totalSold: Number(result.totalSold),
        totalSoldOfAllProducts,
      };
    });

    return Promise.all(statistics);
  }

  public static async getLeastInStockProducts(
    limit = 5,
  ): Promise<ManagerDashboardData['fiveLeastInStockProduct']> {
    const importOrderRepository = await getRepo(ImportOrderEntity);

    // Get the sum of remainingQuantity for each product
    const results = await importOrderRepository
      .createQueryBuilder('importOrder')
      .select('importOrder.product', 'productId')
      .addSelect('SUM(importOrder.remainingQuantity)', 'remainingStock')
      .groupBy('importOrder.product')
      .orderBy('SUM(importOrder.remainingQuantity)', 'ASC')
      .limit(limit)
      .getRawMany();

    // Map the raw results to the desired format
    const productsWithStock = await Promise.all(
      results.map(async (result) => {
        const product = (await CommonService.getRecord({
          entity: ProductEntity,
          filter: { id: result.productId },
          relations: ['productCategory'],
        })) as ProductModelWithStock;
        return {
          ...product,
          remainingStock: Number(result.remainingStock),
        };
      }),
    );

    return productsWithStock;
  }

  public static async getMonthlyProfits(
    year = new Date().getFullYear(),
  ): Promise<number[]> {
    const customerOrderRepository = await getRepo(CustomerOrderEntity);
    const startOfGivenYear = new Date(year, 0, 1);

    const finalStartOfYear = startOfYear(startOfGivenYear);
    const finalEndOfYear = endOfYear(startOfGivenYear);
    // Fetch all 'SHIPPED' orders
    const orders = await customerOrderRepository.find({
      where: {
        status: OrderStatus.SHIPPED,
        updatedAt: Between(finalStartOfYear, finalEndOfYear),
      },
    });

    // Initializing an array to store monthly profits
    const monthlyProfits: number[] = Array(12).fill(0);

    // Iterate over each month and calculate the profit
    eachMonthOfInterval({
      start: finalStartOfYear,
      end: finalEndOfYear,
    }).forEach((monthDate) => {
      if (!isFuture(monthDate)) {
        const monthIndex = getMonth(monthDate);
        orders.forEach((order) => {
          if (order.updatedAt.getMonth() === monthIndex) {
            monthlyProfits[monthIndex] += Number(order.profit);
          }
        });
      }
    });

    return monthlyProfits;
  }

  private static async _getMostRecentOrders(
    limit = 5,
  ): Promise<ManagerDashboardData['fiveMostRecentOrders']> {
    const [orders] = await CommonService.getRecords({
      entity: CustomerOrderEntity,
      paginationParams: {
        page: 1,
        limit,
      },
      relations: ['customer'],
    });

    return orders as ManagerDashboardData['fiveMostRecentOrders'];
  }

  public static async getDashboardData(): Promise<ManagerDashboardData> {
    const todayFinancialStatistic =
      await DashboardService.getFinancialStatistic('today');
    const thisMonthFinancialStatistic =
      await DashboardService.getFinancialStatistic('thisMonth');
    const prevMonthFinancialStatistic =
      await DashboardService.getPrevMonthFinancialStatistic();
    const mostSoldProducts =
      await DashboardService.getStatisticProducts('mostSold');
    const leastSoldProducts =
      await DashboardService.getStatisticProducts('leastSold');
    const fiveLeastInStockProduct =
      await DashboardService.getLeastInStockProducts(5);
    const fiveMostRecentOrders = await DashboardService._getMostRecentOrders();
    // const monthlyProfits = await DashboardService._getMonthlyProfits();

    return {
      todayProfit: todayFinancialStatistic.profit,
      todayOrderNumber: todayFinancialStatistic.orderNumber,
      prevMonthProfit: prevMonthFinancialStatistic.profit,
      prevMonthOrderNumber: prevMonthFinancialStatistic.orderNumber,
      thisMonthProfit: thisMonthFinancialStatistic.profit,
      thisMonthOrderNumber: thisMonthFinancialStatistic.orderNumber,
      mostSoldProducts,
      leastSoldProducts,
      fiveLeastInStockProduct,
      fiveMostRecentOrders,
      // monthlyProfits,
    };
  }
}
