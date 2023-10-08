import { z } from 'zod';

import { zodDate, zodString, zodUuid } from './helper';

const AccountSchema = z.object({
  id: zodUuid('Account.Id'),
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

export { AccountSchema };
export type { AccountModel };
