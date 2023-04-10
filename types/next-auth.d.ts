import type { IAccount } from 'api/models/Account.model/types';

// OVERWRITE THE NEXT-AUTH TYPES (OFFICIAL DOCUMENTATION)
declare module 'next-auth' {
  // interface Session {
  //   user: {
  //     /** The user's unique identifier. */
  //     id: string;
  //     /** The user's role. */
  //     role: 'ADMIN' | 'CUSTOMER' | 'SUPPLIER';
  //   } & DefaultSession['user'];
  // }

  interface Session {
    user: Pick<
      IAccount,
      | 'id'
      | 'fullName'
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'avatarUrl'
      | 'role'
      | 'verified'
    >;
  }

  interface User
    extends Pick<
      IAccount,
      'id' | 'fullName' | 'email' | 'avatarUrl' | 'role' | 'verified'
    > {}
}
