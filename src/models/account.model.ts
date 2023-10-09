import { z } from 'zod';

import type { CustomerModel } from './customer.model';
import type { EmployeeModel } from './employee.model';
import { zodDate, zodString, zodUuid } from './helper';

const AccountSchema = z.object({
  id: zodUuid('Account.Id'),

  customer: zodUuid('Account.CustomerId').optional(),

  employee: zodUuid('Account.EmployeeId').optional(),

  email: zodString('Account.Email').email({
    message: 'Account.Email.InvalidFormat',
  }),

  password: zodString('Account.Password', 6, 50),

  avatarUrl: zodString('Account.AvatarUrl', 1, 500).optional(),

  disabled: z.boolean({
    required_error: 'Account.Disabled.Required',
  }),

  verified: z.boolean({
    required_error: 'Account.Verified.Required',
  }),

  verificationToken: zodString('Account.VerificationToken', 1, 500).optional(),

  verificationTokenExpiry: zodDate(
    'Account.VerificationTokenExpiry',
  ).optional(),

  forgotPasswordToken: zodString(
    'Account.ForgotPasswordToken',
    1,
    500,
  ).optional(),

  forgotPasswordTokenExpiry: zodDate(
    'Account.ForgotPasswordTokenExpiry',
  ).optional(),
});

type AccountModel = z.infer<typeof AccountSchema>;

type AccountReferenceKeys = keyof Pick<AccountModel, 'customer' | 'employee'>;

type PopulateField<K extends keyof AccountModel> = K extends 'customer'
  ? CustomerModel
  : K extends 'employee'
  ? EmployeeModel
  : never;

type PopulateAccountFields<K extends AccountReferenceKeys> = Omit<
  AccountModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedAccountModel = PopulateAccountFields<AccountReferenceKeys>;

export { AccountSchema };
export type { AccountModel, FullyPopulatedAccountModel, PopulateAccountFields };
