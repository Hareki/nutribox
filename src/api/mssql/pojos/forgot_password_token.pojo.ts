export interface IForgotPasswordToken {
  id: string;
  account_id: string;
  created_at: Date;
  token: string;
  expiration_date: Date;
}

export interface IForgotPasswordTokenInput
  extends Omit<IForgotPasswordToken, 'id' | 'created_at' | 'expiration_date'> {}
