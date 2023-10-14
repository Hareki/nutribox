import { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const ChangePasswordDtoSchema = z.object({
  oldPassword: z.string(),
  newPassword: AccountSchema.shape.password,
  // confirmNewPassword: AccountSchema.shape.password,
});
// .refine((data) => data.newPassword === data.confirmNewPassword, {
//   message: 'Account.ConfirmNewPassword.NotMatch',
// });

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;
