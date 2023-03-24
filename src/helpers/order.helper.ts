import { OrderStatus } from 'utils/constants';

export function getOrderStatusName(orderStatusId: string) {
  for (const status in OrderStatus) {
    if (OrderStatus[status].id === orderStatusId) {
      return OrderStatus[status].name;
    }
  }
  return null;
}
