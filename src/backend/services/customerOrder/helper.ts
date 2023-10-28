import { OrderStatus } from 'backend/enums/entities.enum';
import type { EstimatedDeliveryInfo } from 'backend/helpers/address.helper';

export type CheckoutValidation = {
  customerAddress: string;
  storeAddress: string;
  isValidTime: boolean;
  isValidDistance: boolean;
  isValidDuration: boolean;
  estimatedDeliveryInfo: EstimatedDeliveryInfo;
};
export const CustomerOrderStatusOrders = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPING,
  OrderStatus.SHIPPED,
  OrderStatus.CANCELLED,
];

export type ExportOrderDetails = {
  exportOrderId: string;
  importDate: Date;
  expirationDate: Date;
  productName: string;
  exportQuantity: number;
};
