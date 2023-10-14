import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';
import { CustomerSchema } from 'models/customer.model';

export const SignUpDtoSchema = AccountSchema.pick({
  email: true,
  password: true,
}).and(
  CustomerSchema.pick({
    firstName: true,
    lastName: true,
    phone: true,
    birthday: true,
  }),
);

export type SignUpDto = z.infer<typeof SignUpDtoSchema>;
