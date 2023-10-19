import { OrderStatus } from 'backend/enums/entities.enum';
import type { CommonCustomerModel } from 'models/customer.model';

export type OrderStatusCount = {
  total: number;
  pending: number;
  processing: number;
  shipping: number;
  shipped: number;
  cancelled: number;
};

export type DashboardInfo = CommonCustomerModel & {
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
