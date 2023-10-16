import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const VerifyEmailDtoSchema = AccountSchema.pick({
  verificationToken: true,
}).required();

export type VerifyEmailDto = z.infer<typeof VerifyEmailDtoSchema>;
