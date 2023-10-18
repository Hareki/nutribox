export type CredentialsIdentifier =
  | {
      email: string;
      password: string;
      id?: never;
    }
  | {
      id: string;
      email?: never;
      password?: never;
    };
