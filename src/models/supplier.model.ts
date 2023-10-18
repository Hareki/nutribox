import { z } from 'zod';

import { zodDate, zodNumber, zodString, zodUuid } from './helper';
import type { ImportOrderModel } from './importOder.model';

import { PHONE_REGEX } from 'constants/regex.constant';

const SupplierSchema = z.object({
  id: zodUuid('Supplier.Id'),

  createdAt: zodDate('Supplier.CreatedAt'),

  importOrders: z.array(z.string().uuid()).optional(),

  name: zodString('Supplier.Name', 3, 50),

  phone: zodString('Supplier.Phone').regex(PHONE_REGEX, {
    message: 'Supplier.Phone.InvalidFormat',
  }),

  email: zodString('Supplier.Email').email({
    message: 'Supplier.Email.InvalidFormat',
  }),

  provinceCode: zodNumber('CustomerAddress.ProvinceCode', 'int', 1, 10_000),

  districtCode: zodNumber('CustomerAddress.DistrictCode', 'int', 1, 10_000),

  wardCode: zodNumber('CustomerAddress.WardCode', 'int', 1, 100_000),

  provinceName: zodString('CustomerAddress.ProvinceName', 1, 50),

  districtName: zodString('CustomerAddress.ProvinceName', 1, 50),

  wardName: zodString('CustomerAddress.ProvinceName', 1, 50),

  streetAddress: zodString('Supplier.StreetAddress', 1, 100),
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
