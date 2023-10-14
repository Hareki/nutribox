import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const ForgotPasswordDtoSchema = AccountSchema.pick({
  email: true,
}).required();

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;
