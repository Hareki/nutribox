import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const ResetPasswordDtoSchema = AccountSchema.pick({
  forgotPasswordToken: true,
  password: true,
}).required();

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;
