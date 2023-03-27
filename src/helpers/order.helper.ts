import { AllStatusIdArray, OrderStatus } from 'utils/constants';

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
  const nextOrderStatusId = getNextOrderStatusId(currentId);
  if (!nextOrderStatusId) return null;
  return getOrderStatusName(nextOrderStatusId);
}
