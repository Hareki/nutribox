import { z } from 'zod';

import {
  AccountSchema,
  PasswordConfirmationSchema,
} from 'models/account.model';
import { zodString } from 'models/helper';

export const ChangePasswordDtoSchema = z.object({
  oldPassword: z.string(),
  newPassword: AccountSchema.shape.password,
  // confirmNewPassword: AccountSchema.shape.password,
});
// .refine((data) => data.newPassword === data.confirmNewPassword, {
//   message: 'Account.ConfirmNewPassword.NotMatch',
// });

export const ChangePasswordFormValueSchema = z
  .intersection(
    PasswordConfirmationSchema,
    z.object({
      oldPassword: zodString('Account.Password', 1, 50),
    }),
  )
  .refine((data) => data.password !== data.oldPassword, {
    message: 'Account.OldPassword.Same',
    path: ['password'],
  });

export type ChangePasswordFormValues = z.infer<
  typeof ChangePasswordFormValueSchema
>;

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;
