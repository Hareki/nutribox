import { z } from 'zod';

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

  birthDay: zodDate('Customer.Birthday'),

  addresses: z.array(z.string().uuid()).optional(),

  orders: z.array(z.string().uuid()).optional(),

  cartItems: z.array(z.string().uuid()).optional(),
});

type CustomerModel = z.infer<typeof CustomerSchema>;

export { CustomerSchema };
export type { CustomerModel };
