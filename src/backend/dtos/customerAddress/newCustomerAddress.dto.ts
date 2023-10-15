import type { z } from 'zod';

import { CustomerAddressSchema } from 'models/customerAddress.model';

export const NewCustomerAddressDtoSchema = CustomerAddressSchema.pick({
  isDefault: true,
  type: true,
  provinceCode: true,
  districtCode: true,
  wardCode: true,
  streetAddress: true,
}).required();

export type NewCustomerAddressDto = z.infer<typeof NewCustomerAddressDtoSchema>;
