import { z } from 'zod';

import type { AccountModel } from './account.model';
import type { CartItemModel } from './cartItem.model';
import type { CustomerAddressModel } from './customerAddress.model';
import type { CustomerOrderModel } from './customerOrder.model';
import { zodDate, zodString, zodUuid } from './helper';

import { NAME_REGEX, PHONE_REGEX } from 'constants/regex.constant';

const CustomerSchema = z.object({
  id: zodUuid('Customer.Id'),

  account: zodUuid('Customer.AccountId'),

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

  customerAddresses: z.array(z.string().uuid()).optional(),

  customerOrders: z.array(z.string().uuid()).optional(),

  cartItems: z.array(z.string().uuid()).optional(),
});

type CustomerModel = z.infer<typeof CustomerSchema>;

type CustomerReferenceKeys = keyof Pick<
  CustomerModel,
  'account' | 'customerAddresses' | 'customerOrders' | 'cartItems'
>;

type PopulateField<K extends keyof CustomerModel> = K extends 'account'
  ? AccountModel
  : K extends 'addresses'
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

export { CustomerSchema };
export type {
  CustomerModel,
  FullyPopulatedCustomerModel,
  PopulateCustomerFields,
};
