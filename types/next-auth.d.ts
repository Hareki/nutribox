import type { EmployeeRole } from 'backend/enums/entities.enum';
import type { CredentialInputs, UserType } from 'backend/types/auth';
import type {
  CommonCustomerAccountModel,
  CommonEmployeeAccountModel,
} from 'models/account.model';

export type AuthenticatedAccount = (
  | CommonCustomerAccountModel
  | CommonEmployeeAccountModel
) & {
  userType: UserType;
};

declare module 'next-auth' {
  interface Session {
    // TODO change the name to customerAccount
    account: CommonCustomerAccountModel;

    // employee account
    employeeAccount: CommonEmployeeAccountModel;
  }

  interface User extends AuthenticatedAccount {}
}

declare module 'next-auth/react' {
  export interface SignInOptions extends CredentialInputs {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    accountId?: string;
    userType?: UserType;
    employeeRole?: EmployeeRole;
    exp?: number;
  }
}
