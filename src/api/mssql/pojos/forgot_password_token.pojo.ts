export interface PoIForgotPasswordToken {
  id: string;
  account_id: string;
  created_at: Date;
  token: string;
  expiration_date: Date;
}

export interface PoIForgotPasswordTokenInput
  extends Omit<
    PoIForgotPasswordToken,
    'id' | 'created_at' | 'expiration_date'
  > {}
