import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import StatisticController from 'api/controllers/Statistic.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type {
  IProduct,
  IProductWithTotalQuantity,
} from 'api/models/Product.model/types';
import type { JSendResponse } from 'api/types/response.type';

export interface StatisticProduct {
  product: IProduct;
  totalSold: number;
  totalSoldOfAllProducts: number;
}

export interface DashboardData {
  todayProfit: number;
  todayOrderNumber: number;

  // calculate previous month profit until day of this month
  prevMonthProfit: number;
  prevMonthOrderNumber: number;

  thisMonthProfit: number;
  thisMonthOrderNumber: number;

  mostSoldProducts: StatisticProduct[];
  leastSoldProducts: StatisticProduct[];

  fiveMostRecentOrders: ICustomerOrder[];
  fiveAlmostOutOfStockProducts: IProductWithTotalQuantity[];

  monthlyProfits: number[];
}

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<DashboardData>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  await connectToDB();

  const todayProfit = await StatisticController.getTodayProfit();
  const todayOrderNumber = await StatisticController.getTodayOrderNumber();

  const prevMonthProfit = await StatisticController.getPreviousMonthProfit();
  const prevMonthOrderNumber =
    await StatisticController.getPreviousMonthOrderNumber();

  const thisMonthProfit = await StatisticController.getThisMonthProfit();
  const thisMonthOrderNumber =
    await StatisticController.getThisMonthOrderNumber();

  const { mostSoldProducts, leastSoldProducts } =
    await StatisticController.getMostAndLeastSoldProducts();

  const fiveMostRecentOrders =
    await StatisticController.getFiveMostRecentOrders();
  const fiveAlmostOutOfStockProducts =
    await StatisticController.getFiveProductsWithLeastTotalQuantity();

  const monthlyProfits = await StatisticController.getMonthlyProfits();

  const data: DashboardData = {
    todayProfit,
    todayOrderNumber,
    prevMonthProfit,
    prevMonthOrderNumber,
    thisMonthProfit,
    thisMonthOrderNumber,
    mostSoldProducts,
    leastSoldProducts,
    fiveMostRecentOrders,
    fiveAlmostOutOfStockProducts,
    monthlyProfits,
  };

  res.status(StatusCodes.OK).json({
    status: 'success',
    data,
  });
});

export default handler;
