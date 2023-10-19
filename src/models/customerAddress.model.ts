import { z } from 'zod';

import type { CustomerModel } from './customer.model';
import { zodDate, zodNumber, zodString, zodUuid } from './helper';

const CustomerAddressSchema = z.object({
  id: zodUuid('CustomerAddress.Id'),

  createdAt: zodDate('CustomerAddress.CreatedAt'),

  customer: zodUuid('CustomerAddress.CustomerId'),

  provinceCode: zodNumber('CustomerAddress.ProvinceCode', 'int', 1, 10_000),

  districtCode: zodNumber('CustomerAddress.DistrictCode', 'int', 1, 10_000),

  wardCode: zodNumber('CustomerAddress.WardCode', 'int', 1, 100_000),

  provinceName: zodString('CustomerAddress.ProvinceName', 1, 50),

  districtName: zodString('CustomerAddress.ProvinceName', 1, 50),

  wardName: zodString('CustomerAddress.ProvinceName', 1, 50),

  streetAddress: zodString('CustomerAddress.StreetAddress', 1, 500),

  isDefault: z.boolean({
    required_error: 'CustomerAddress.IsDefault.Required',
  }),

  title: zodString('CustomerAddress.Title', 1, 50),
});

type CustomerAddressModel = z.infer<typeof CustomerAddressSchema>;

type CustomerAddressReferenceKeys = keyof Pick<
  CustomerAddressModel,
  'customer'
>;

type PopulateField<K extends keyof CustomerAddressModel> = K extends 'customer'
  ? CustomerModel
  : never;

type PopulateCustomerAddressFields<K extends CustomerAddressReferenceKeys> =
  Omit<CustomerAddressModel, K> & {
    [P in K]: PopulateField<P>;
  };

type FullyPopulatedCustomerAddressModel =
  PopulateCustomerAddressFields<CustomerAddressReferenceKeys>;

export { CustomerAddressSchema };
export type {
  CustomerAddressModel,
  FullyPopulatedCustomerAddressModel,
  PopulateCustomerAddressFields,
};
