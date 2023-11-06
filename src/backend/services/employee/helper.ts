import { OrderStatus } from 'backend/enums/entities.enum';
import type { PopulateEmployeeFields } from 'models/employee.model';

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

export type CommonEmployeeModel = PopulateEmployeeFields<'account'>;
