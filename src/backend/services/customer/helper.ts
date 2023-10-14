import type { CustomerModel } from 'models/customer.model';

export type OrderStatusCount = {
  total: number;
  pending: number;
  processing: number;
  shipping: number;
  shipped: number;
};

export type DashboardInfo = CustomerModel & {
  orderStatusCount: OrderStatusCount;
};
