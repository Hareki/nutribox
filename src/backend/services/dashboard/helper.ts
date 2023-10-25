import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';
import type { PopulateProductFields, ProductModel } from 'models/product.model';

export type StatisticProduct = {
  product: ProductModel;
  totalSold: number;
  totalSoldOfAllProducts: number;
};

export type FinancialStatistic = { profit: number; orderNumber: number };

export type ProductModelWithStock = PopulateProductFields<'productCategory'> & {
  remainingStock: number;
};

export type ManagerDashboardData = {
  todayProfit: number;
  todayOrderNumber: number;

  // Important note: Only take in to account the "profit" of CustomerOrderEntity having status "SHIPPED"
  prevMonthProfit: number; // calculate previous month profit until the day of this month, for example, if today is 2020-04-15, then calculate the profit of 2020-03-01 to 2020-03-15
  prevMonthOrderNumber: number; // calculate previous month order number until the day of this month, for example, if today is 2020-04-15, then calculate the order number of 2020-03-01 to 2020-03-15

  thisMonthProfit: number; // calculate this month profit until today, based on "profit" of CustomerOrderEntity
  thisMonthOrderNumber: number; // calculate this month order number until today, count the "id" of CustomerOrderEntity of that product

  // Important note: Only take in to account the "quantity" of CustomerOrderItemEntity having CustomerOrderEntity having status "SHIPPED"
  mostSoldProducts: StatisticProduct[]; // Of all time, calculate based on the "quantity" of CustomerOrderItemEntity of that product
  leastSoldProducts: StatisticProduct[]; // Of all time, calculate based on the "quantity" of CustomerOrderItemEntity of that product

  fiveMostRecentOrders: PopulateCustomerOrderFields<'customer'>[];
  fiveLeastInStockProduct: ProductModelWithStock[];

  // monthlyProfits: number[]; // 12 months, future months are 0
};
