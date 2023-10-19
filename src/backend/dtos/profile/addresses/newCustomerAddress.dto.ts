import type { z } from 'zod';

import { BaseAddressSchema } from 'backend/dtos/checkout.dto';
import { CustomerAddressSchema } from 'models/customerAddress.model';

export const NewCustomerAddressDtoSchema = CustomerAddressSchema.pick({
  isDefault: true,
  title: true,
  provinceCode: true,
  districtCode: true,
  wardCode: true,
  streetAddress: true,
}).required();

export const CustomerAddressFormSchema = NewCustomerAddressDtoSchema.omit({
  districtCode: true,
  wardCode: true,
  provinceCode: true,
}).and(BaseAddressSchema);

export type CustomerAddressFormValues = z.infer<
  typeof CustomerAddressFormSchema
>;

export type NewCustomerAddressDto = z.infer<typeof NewCustomerAddressDtoSchema>;
