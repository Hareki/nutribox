import type { z } from 'zod';

import { NewCustomerAddressDtoSchema } from './newCustomerAddress.dto';

import { CustomerAddressSchema } from 'models/customerAddress.model';

export const UpdateCustomerAddressDtoSchema =
  NewCustomerAddressDtoSchema.required().and(
    CustomerAddressSchema.pick({ id: true }).required(),
  );

export type UpdateCustomerAddressDto = z.infer<
  typeof UpdateCustomerAddressDtoSchema
>;
