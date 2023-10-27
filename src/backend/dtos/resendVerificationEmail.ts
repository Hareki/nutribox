import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const ResendVerificationEmailDtoSchema = AccountSchema.pick({
  email: true,
}).required();

export type ResendVerificationEmailDto = z.infer<
  typeof ResendVerificationEmailDtoSchema
>;
