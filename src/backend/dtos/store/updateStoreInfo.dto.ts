import type { z } from 'zod';

import { BaseAddressSchema } from '../checkout.dto';

import { StoreSchema } from 'models/store.model';

export const UpdateStoreInfoDtoSchema = StoreSchema.pick({
  email: true,
  phone: true,
  provinceCode: true,
  districtCode: true,
  wardCode: true,
  streetAddress: true,
});

export const UpdateStoreInfoFormSchema = UpdateStoreInfoDtoSchema.omit({
  provinceCode: true,
  districtCode: true,
  wardCode: true,
}).and(BaseAddressSchema);

export type UpdateStoreInfoFormValues = z.infer<
  typeof UpdateStoreInfoFormSchema
>;

export type UpdateStoreInfoDto = z.infer<typeof UpdateStoreInfoDtoSchema>;
