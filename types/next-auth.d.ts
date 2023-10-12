import type { EmployeeRole } from 'backend/enums/Entities.enum';
import type {
  AccountWithPopulatedSide,
  CredentialInputs,
} from 'backend/types/auth';
import type { FullyPopulatedAccountModel } from 'models/account.model';

declare module 'next-auth' {
  interface Session {
    user: Omit<FullyPopulatedAccountModel, 'password'> & {
      password?: string;
    };
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
