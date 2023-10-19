import type { z } from 'zod';

import type { PasswordConfirmationSchema } from 'models/account.model';
import { AccountSchema } from 'models/account.model';

export const ResetPasswordDtoSchema = AccountSchema.pick({
  forgotPasswordToken: true,
  password: true,
}).required();

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

export type ResetPasswordFormValues = z.infer<
  typeof PasswordConfirmationSchema
>;
