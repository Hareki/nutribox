import type { EmployeeRole } from 'backend/enums/entities.enum';
import type {
  AccountWithPopulatedSide,
  CredentialInputs,
} from 'backend/types/auth';
import type { CommonCustomerAccountModel } from 'models/account.model';

declare module 'next-auth' {
  interface Session {
    // TODO: this should be named customerAccount
    account: CommonCustomerAccountModel;
  }

  interface User extends AccountWithPopulatedSide {}
}

declare module 'next-auth/react' {
  export interface SignInOptions extends CredentialInputs {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    accountId?: string;
    employeeRole?: EmployeeRole | undefined;
    exp?: number;
  }
}
