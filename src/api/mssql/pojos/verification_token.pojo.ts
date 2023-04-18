export interface IVerificationToken {
  id: string;
  account_id: string;

  created_at: Date;
  token: string;
  expiration_date: Date;
}

export interface IVerificationTokenInput
  extends Omit<IVerificationToken, 'id' | 'created_at' | 'expiration_date'> {}
