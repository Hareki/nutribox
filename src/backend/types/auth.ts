import type { CustomerEntity } from 'backend/entities/customer.entity';
import type { EmployeeEntity } from 'backend/entities/employee.entity';
import type {
  CommonCustomerAccountModel,
  FullyPopulatedAccountModel,
} from 'models/account.model';

export type UserType = 'customer' | 'employee';
export type UserEntity = typeof CustomerEntity | typeof EmployeeEntity;
export type CredentialInputs = {
  email: string;
  password: string;
  userType: UserType;
};

export type AccountWithPopulatedSide<U extends UserType> = U extends 'customer'
  ? CommonCustomerAccountModel
  : Omit<FullyPopulatedAccountModel, 'customer'>;
