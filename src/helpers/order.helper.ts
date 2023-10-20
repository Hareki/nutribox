import { assertNever } from './assertion.helper';

import { OrderStatus, PaymentMethod } from 'backend/enums/entities.enum';
import {
  CustomerOrderStatusOrders,
  type OrderStatusCount,
} from 'backend/services/customer/helper';

export function translateOrderStatusCountLabel(
  orderStatusName: keyof OrderStatusCount,
) {
  let name = '';
  switch (orderStatusName) {
    case 'total':
      name = 'tất cả';
      break;
    case 'pending':
      name = 'chờ xác nhận';
      break;
    case 'processing':
      name = 'đang xử lý';
      break;
    case 'shipping':
      name = 'đang giao';
      break;
    case 'shipped':
      name = 'đã giao';
      break;
    case 'cancelled':
      name = 'đã hủy';
      break;
    default: {
      assertNever(orderStatusName);
    }
  }

  return `Đơn ${name.toLowerCase()}`;
}

export function getOrderStatusName(orderStatus: OrderStatus) {
  let name = '';
  switch (orderStatus) {
    case OrderStatus.PENDING:
      name = 'Chờ xác nhận';
      break;
    case OrderStatus.PROCESSING:
      name = 'Đang xử lý';
      break;
    case OrderStatus.SHIPPING:
      name = 'Đang giao';
      break;
    case OrderStatus.SHIPPED:
      name = 'Đã giao';
      break;
    case OrderStatus.CANCELLED:
      name = 'Đã hủy';
      break;
    default: {
      assertNever(orderStatus);
    }
  }

  return name;
}

export const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PaymentMethod.COD:
      return 'Tiền mặt';
    case PaymentMethod.PayPal:
      return 'PayPal';
    default:
      return '';
  }
};

export function getNextOrderStatusId(currentOrderStatus: OrderStatus) {
  const index = CustomerOrderStatusOrders.indexOf(currentOrderStatus);
  if (index === -1) {
    throw new Error('Invalid order status id');
  }
  return CustomerOrderStatusOrders[index + 1];
}

export function getNextOrderStatusName(currentOrderStatus: OrderStatus) {
  const nextOrderStatusId = getNextOrderStatusId(currentOrderStatus);

  if (!nextOrderStatusId) return null;
  return getOrderStatusName(nextOrderStatusId);
}
