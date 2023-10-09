import { z } from 'zod';

import { zodString, zodUuid } from './helper';
import type { ImportOrderModel } from './importOder.model';

import { PHONE_REGEX } from 'constants/regex.constant';

const SupplierSchema = z.object({
  id: zodUuid('Supplier.Id'),

  name: zodString('Supplier.Name', 3, 50),

  phone: zodString('Supplier.Phone').regex(PHONE_REGEX, {
    message: 'Supplier.Phone.InvalidFormat',
  }),

  email: zodString('Supplier.Email').email({
    message: 'Supplier.Email.InvalidFormat',
  }),

  provinceCode: zodString('Supplier.ProvinceCode.Required', 1, 5),

  districtCode: zodString('Supplier.DistrictCode.Required', 1, 5),

  wardCode: zodString('Supplier.WardCode.Required', 1, 5),

  streetAddress: zodString('Supplier.StreetAddress', 1, 100),

  importOrders: z.array(z.string().uuid()).optional(),
});

type SupplierModel = z.infer<typeof SupplierSchema>;

type SupplierReferenceKeys = keyof Pick<SupplierModel, 'importOrders'>;

type PopulateField<K extends keyof SupplierModel> = K extends 'importOrders'
  ? ImportOrderModel[]
  : never;

type PopulateSupplierFields<K extends SupplierReferenceKeys> = Omit<
  SupplierModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedSupplierModel =
  PopulateSupplierFields<SupplierReferenceKeys>;

export { SupplierSchema };
export type {
  SupplierModel,
  FullyPopulatedSupplierModel,
  PopulateSupplierFields,
};
