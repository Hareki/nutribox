import { z } from 'zod';

import { AccountSchema } from 'models/account.model';
import { zodString } from 'models/helper';

export const SignInDtoSchema = AccountSchema.pick({
  email: true,
}).and(
  z.object({
    password: zodString('Account.Password'), // create separately to remove the strong password requirement
  }),
);

export type SignInDto = z.infer<typeof SignInDtoSchema>;
