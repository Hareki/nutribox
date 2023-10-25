import type { z } from 'zod';

import { BaseAddressSchema } from '../checkout.dto';

import { SupplierSchema } from 'models/supplier.model';

export const NewSupplierDtoSchema = SupplierSchema.pick({
  provinceCode: true,
  districtCode: true,
  wardCode: true,
  streetAddress: true,
  email: true,
  phone: true,
  name: true,
});

export const SupplierFormSchema = NewSupplierDtoSchema.omit({
  provinceCode: true,
  districtCode: true,
  wardCode: true,
}).and(BaseAddressSchema);

export type SupplierFormValues = z.infer<typeof SupplierFormSchema>;

export type NewSupplierDto = z.infer<typeof NewSupplierDtoSchema>;
