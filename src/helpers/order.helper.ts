import { assertNever } from './assertion.helper';

import { OrderStatus } from 'backend/enums/entities.enum';
import type { OrderStatusCount } from 'backend/services/customer/helper';
import { AllStatusIdArray } from 'utils/constants';

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

export function getOrderStatusName(orderStatusId: string) {
  for (const status in OrderStatus) {
    if (OrderStatus[status].id === orderStatusId) {
      return OrderStatus[status].name;
    }
  }
  return null;
}

export function getNextOrderStatusId(currentId: string) {
  const index = AllStatusIdArray.indexOf(currentId);
  if (index === -1) {
    throw new Error('Invalid order status id');
  }
  return AllStatusIdArray[index + 1];
}

export function getNextOrderStatusName(currentId: string) {
  console.log(
    'file: order.helper.ts:55 - getNextOrderStatusName - currentId:',
    currentId,
  );
  const nextOrderStatusId = getNextOrderStatusId(currentId);
  console.log(
    'file: order.helper.ts:56 - getNextOrderStatusName - nextOrderStatusId:',
    nextOrderStatusId,
  );
  if (!nextOrderStatusId) return null;
  return getOrderStatusName(nextOrderStatusId);
}
