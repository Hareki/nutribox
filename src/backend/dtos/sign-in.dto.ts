import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const SignInDtoSchema = AccountSchema.pick({
  email: true,
  password: true,
});

export type SignInDto = z.infer<typeof SignInDtoSchema>;
