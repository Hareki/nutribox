import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const VerifyPasswordDtoSchema = AccountSchema.pick({
  verificationToken: true,
}).required();

export type VerifyPasswordDto = z.infer<typeof VerifyPasswordDtoSchema>;
