import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const VerifyCustomerEmailDtoSchema = AccountSchema.pick({
  verificationToken: true,
}).required();

export type VerifyCustomerEmailDto = z.infer<
  typeof VerifyCustomerEmailDtoSchema
>;
