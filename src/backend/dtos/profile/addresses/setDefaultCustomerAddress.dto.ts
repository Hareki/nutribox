import type { z } from 'zod';

import { NewCustomerAddressDtoSchema } from './newCustomerAddress.dto';

export const SetDefaultCustomerAddressDtoSchema =
  NewCustomerAddressDtoSchema.pick({
    isDefault: true,
  }).required();

export type SetDefaultCustomerAddressDto = z.infer<
  typeof SetDefaultCustomerAddressDtoSchema
>;
