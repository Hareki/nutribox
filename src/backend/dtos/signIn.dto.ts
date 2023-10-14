import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const SignInDtoSchema = AccountSchema.pick({
  email: true,
  password: true,
}).required();

export type SignInDto = z.infer<typeof SignInDtoSchema>;
