import { OrderStatus } from 'backend/enums/entities.enum';

export const EmployeeCancellableOrderStatuses = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPING,
];

export const EmployeeUpgradeableOrderStatuses = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPING,
];
