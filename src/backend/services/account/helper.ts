export type CredentialsIdentifier =
  | {
      email: string;
      id?: never;
    }
  | {
      email?: never;
      id: string;
    };
