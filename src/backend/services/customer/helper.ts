import { OrderStatus } from 'backend/enums/entities.enum';
import type { CommonCustomerModel, CustomerModel } from 'models/customer.model';

export type OrderStatusCount = {
  total: number;
  pending: number;
  processing: number;
  shipping: number;
  shipped: number;
  cancelled: number;
};

export type CustomerDashboardData = CommonCustomerModel & {
  orderStatusCount: OrderStatusCount;
};

export const CustomerCancellableOrderStatuses = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
];

export interface ProfileMenuCount {
  addressCount: number;
  orderCount: number;
}

export type CustomerWithTotalOrders = CustomerModel & {
  totalOrders: number;
};
