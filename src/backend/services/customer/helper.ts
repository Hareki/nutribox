import { OrderStatus } from 'backend/enums/entities.enum';
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

export const CustomerCancellableOrderStatuses = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
];
