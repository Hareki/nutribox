import { z } from 'zod';

import type { AccountModel } from './account.model';
import type { CartItemModel } from './cartItem.model';
import type { CustomerAddressModel } from './customerAddress.model';
import type { CustomerOrderModel } from './customerOrder.model';
import { zodDate, zodString, zodUuid } from './helper';

import {
  MASK_PHONE_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
} from 'constants/regex.constant';

const CustomerSchema = z.object({
  id: zodUuid('Customer.Id'),

  createdAt: zodDate('Customer.CreatedAt'),

  account: zodUuid('Customer.AccountId'),

  customerAddresses: z.array(zodUuid('Customer.CustomerAddresses')).optional(),

  customerOrders: z.array(zodUuid('Customer.CustomerOrders')).optional(),

  cartItems: z.array(zodUuid('Customer.CartItems')).optional(),

  firstName: zodString('Customer.FirstName', 1, 50).regex(NAME_REGEX, {
    message: 'Customer.FirstName.InvalidFormat',
  }),

  lastName: zodString('Customer.LastName', 1, 50).regex(NAME_REGEX, {
    message: 'Customer.LastName.InvalidFormat',
  }),

  email: zodString('Customer.Email').email({
    message: 'Customer.Email.InvalidFormat',
  }),

  phone: zodString('Customer.Phone', 1, 50).regex(PHONE_REGEX, {
    message: 'Customer.Phone.InvalidFormat',
  }),

  birthday: zodDate('Customer.Birthday'),
});

type CustomerModel = z.infer<typeof CustomerSchema>;

type CustomerReferenceKeys = keyof Pick<
  CustomerModel,
  'account' | 'customerAddresses' | 'customerOrders' | 'cartItems'
>;

type PopulateField<K extends keyof CustomerModel> = K extends 'account'
  ? AccountModel
  : K extends 'customerAddresses'
  ? CustomerAddressModel[]
  : K extends 'customerOrders'
  ? CustomerOrderModel[]
  : K extends 'cartItems'
  ? CartItemModel[]
  : never;

type PopulateCustomerFields<K extends CustomerReferenceKeys> = Omit<
  CustomerModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedCustomerModel =
  PopulateCustomerFields<CustomerReferenceKeys>;

type CommonCustomerModel = PopulateCustomerFields<
  'customerAddresses' | 'cartItems'
>;

export { CustomerSchema };
export type {
  CustomerModel,
  CommonCustomerModel,
  FullyPopulatedCustomerModel,
  PopulateCustomerFields,
};
