import type { PopulateCustomerFields } from 'models/customer.model';
import type { PopulateEmployeeFields } from 'models/employee.model';

export type CredentialsIdentifier =
  | {
      email: string;
      id?: never;
    }
  | {
      email?: never;
      id: string;
    };

export type PopulateUserAccountField =
  | PopulateCustomerFields<'account'>
  | PopulateEmployeeFields<'account'>;
