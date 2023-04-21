import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { defaultOnError, defaultOnNoMatch } from 'api/base/next-connect';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
// import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type {
  IProduct as IProductModel,
  IProductWithTotalQuantity,
} from 'api/models/Product.model/types';
import type { ICustomerOrder as ICustomerOrderPojo } from 'api/mssql/pojos/customer_order.pojo';
import type {
  IProduct as IProductPojo,
  IProductWithTotalQuantity as IProductWithTotalQuantityPojo,
} from 'api/mssql/pojos/product.pojo';
import { virtuals } from 'api/mssql/virtuals';
import type { JSendResponse } from 'api/types/response.type';

export interface StatisticProduct {
  product: IProductModel;
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

type ProfitAndOrderNumberFields = {
  today_profit: number;
  today_order_number: number;
  this_month_profit: number;
  this_month_order_number: number;
  prev_month_profit: number;
  prev_month_order_number: number;
};

type MostAndLeastSoldProductsFields = {
  product: string;
  total_sold: number;
  total_sold_of_all_products: number;
};

type MonthlyProfitsFields = {
  month: string;
  profit: number;
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<JSendResponse<DashboardData>>
>({
  onError: defaultOnError,
  onNoMatch: defaultOnNoMatch,
}).get(async (req, res) => {
  const profitAndOrderNumber = (
    await executeUsp<ProfitAndOrderNumberFields>(
      'usp_FetchProfitAndOrderNumber',
    )
  ).data[0];

  const mostSoldProductsTable = (
    await executeUsp<MostAndLeastSoldProductsFields>(
      'usp_FetchMostSoldProducts',
    )
  ).data;

  const leastSoldProductsTable = (
    await executeUsp<MostAndLeastSoldProductsFields>(
      'usp_FetchLeastSoldProducts',
    )
  ).data;

  const monthlyProfitsTable = (
    await executeUsp<MonthlyProfitsFields>('usp_FetchMonthlyProfit')
  ).data;

  const fiveMostRecentOrdersTable = (
    await executeUsp<ICustomerOrderPojo>('usp_FetchMostRecentOrders', [
      {
        name: 'Limit',
        type: sql.Int,
        value: 5,
      },
    ])
  ).data;

  const fiveAlmostOutOfStockProductsTable = (
    await executeUsp<IProductWithTotalQuantityPojo>(
      'usp_FetchLeastInStockProducts',
      [
        {
          name: 'Limit',
          type: sql.Int,
          value: 5,
        },
      ],
    )
  ).data;

  // ==== MAPPING DATA ====
  const todayProfit = profitAndOrderNumber.today_profit;
  const todayOrderNumber = profitAndOrderNumber.today_order_number;
  const prevMonthProfit = profitAndOrderNumber.prev_month_profit;
  const prevMonthOrderNumber = profitAndOrderNumber.prev_month_order_number;
  const thisMonthProfit = profitAndOrderNumber.this_month_profit;
  const thisMonthOrderNumber = profitAndOrderNumber.this_month_order_number;

  const mostSoldProducts: StatisticProduct[] = mostSoldProductsTable.map(
    (row) => {
      const productSnake: IProductPojo = JSON.parse(row.product);
      console.log('file: dashboard.ts:131 - row.product:', row.product);
      return {
        // TODO Implement a function to map IProductPOJO to IProductModel
        product: {
          id: productSnake.id,
          name: productSnake.name,
          available: productSnake.available,
          category: productSnake.category_id as any,
          description: productSnake.description,
          defaultSupplier: productSnake.default_supplier_id as any,
          expirations: [], // FIXME Incorrect
          imageUrls: [], // FIXME Incorrect
          retailPrice: productSnake.retail_price,
          wholesalePrice: productSnake.import_price,
          shelfLife: productSnake.shelf_life,
          slug: virtuals.getSlug(productSnake.name),
        },
        totalSold: row.total_sold,
        totalSoldOfAllProducts: row.total_sold_of_all_products,
      };
    },
  );

  const leastSoldProducts: StatisticProduct[] = leastSoldProductsTable.map(
    (row) => {
      const productSnake: IProductPojo = JSON.parse(row.product);
      return {
        // TODO Implement a function to map IProductPOJO to IProductModel
        product: {
          id: productSnake.id,
          name: productSnake.name,
          available: productSnake.available,
          category: productSnake.category_id as any,
          description: productSnake.description,
          defaultSupplier: productSnake.default_supplier_id as any,
          expirations: [],
          imageUrls: [],
          retailPrice: productSnake.retail_price,
          wholesalePrice: productSnake.import_price,
          shelfLife: productSnake.shelf_life,
          slug: virtuals.getSlug(productSnake.name),
        },
        totalSold: row.total_sold,
        totalSoldOfAllProducts: row.total_sold_of_all_products,
      };
    },
  );

  const monthlyProfits: number[] = monthlyProfitsTable.map((row) => row.profit);

  // TODO Not yet mapped, just return the pojo, deal with it later
  const fiveMostRecentOrders: ICustomerOrder[] = fiveMostRecentOrdersTable.map(
    (row) => row,
  ) as any;

  const fiveAlmostOutOfStockProducts: IProductWithTotalQuantity[] =
    fiveAlmostOutOfStockProductsTable.map((row) => row) as any;

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
