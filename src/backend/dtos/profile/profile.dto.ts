import type { z } from 'zod';

import { CustomerSchema } from 'models/customer.model';

export const UpdateProfileDtoSchema = CustomerSchema.pick({
  firstName: true,
  lastName: true,
  birthday: true,
  phone: true,
}).required();

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
