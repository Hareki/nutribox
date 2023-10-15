import type { z } from 'zod';

import { NewCustomerAddressDtoSchema } from './newCustomerAddress.dto';

export const UpdateCustomerAddressDtoSchema =
  NewCustomerAddressDtoSchema.required();

export type UpdateCustomerAddressDto = z.infer<
  typeof UpdateCustomerAddressDtoSchema
>;
