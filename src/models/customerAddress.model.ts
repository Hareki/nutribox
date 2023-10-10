import { z } from 'zod';

import type { CustomerModel } from './customer.model';
import { zodDate, zodString, zodUuid } from './helper';

import { CustomerAddressType } from 'backend/enums/Entities.enum';

const CustomerAddressSchema = z.object({
  id: zodUuid('CustomerAddress.Id'),

  createdAt: zodDate('CustomerAddress.CreatedAt'),

  customer: zodUuid('CustomerAddress.CustomerId'),

  provinceCode: zodString('CustomerAddress.ProvinceCode', 1, 50),

  districtCode: zodString('CustomerAddress.DistrictCode', 1, 50),

  wardCode: zodString('CustomerAddress.WardCode', 1, 50),

  streetAddress: zodString('CustomerAddress.StreetAddress', 1, 500),

  isDefault: z.boolean({
    required_error: 'CustomerAddress.IsDefault.Required',
  }),

  type: z.nativeEnum(CustomerAddressType, {
    required_error: 'CustomerAddress.Type.Required',
  }),
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
