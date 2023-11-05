import type { z } from 'zod';

import { AccountSchema } from 'models/account.model';

export const VerifyEmployeeEmailDtoSchema = AccountSchema.pick({
  verificationToken: true,
  password: true,
}).required();

export type VerifyEmployeeEmailDto = z.infer<
  typeof VerifyEmployeeEmailDtoSchema
>;
