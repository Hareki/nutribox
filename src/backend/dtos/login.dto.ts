import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const LoginDtoSchema = AccountSchema.pick({
  email: true,
  password: true,
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;
