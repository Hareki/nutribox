import { AllStatusIdArray, OrderStatus } from 'utils/constants';

export function translateOrderStatusCountLabel(
  orderStatusName:
    | 'total'
    | 'pending'
    | 'processing'
    | 'delivering'
    | 'delivered'
    | 'cancelled',
) {
  let name = '';
  switch (orderStatusName) {
    case 'total':
      name = 'tất cả';
      break;
    case 'pending':
      name = OrderStatus.Pending.name;
      break;
    case 'processing':
      name = OrderStatus.Processing.name;
      break;
    case 'delivering':
      name = OrderStatus.Delivering.name;
      break;
    case 'delivered':
      name = OrderStatus.Delivered.name;
      break;
    case 'cancelled':
      name = OrderStatus.Cancelled.name;
      break;
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
