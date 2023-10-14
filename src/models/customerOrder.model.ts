import { z } from 'zod';

import type { AccountModel } from './account.model';
import type { CustomerModel } from './customer.model';
import { zodDate, zodNumber, zodString, zodUuid } from './helper';

import { OrderStatus, PaymentMethod } from 'backend/enums/entities.enum'; // Assuming enums are defined somewhere
import { PHONE_REGEX } from 'constants/regex.constant';

const CustomerOrderSchema = z.object({
  id: zodUuid('CustomerOrder.Id'),

  createdAt: zodDate('CustomerOrder.CreatedAt'),

  customer: zodUuid('CustomerOrder.CustomerId').optional(),

  customerOrderItems: z.array(z.string().uuid()),

  status: z.nativeEnum(OrderStatus, {
    required_error: 'CustomerOrder.Status.Required',
  }),

  phone: zodString('CustomerOrder.Phone').regex(PHONE_REGEX, {
    message: 'CustomerOrder.Phone.InvalidFormat',
  }),

  paidOnlineVia: z.nativeEnum(PaymentMethod).optional(),

  provinceCode: zodString('CustomerOrder.ProvinceCode', 1, 5),

  districtCode: zodString('CustomerOrder.DistrictCode', 1, 5),

  wardCode: zodString('CustomerOrder.WardCode', 1, 5),

  streetAddress: zodString('CustomerOrder.StreetAddress', 1, 100),

  note: zodString('CustomerOrder.Note', 1, 500).optional(),

  profit: zodNumber('CustomerOrder.Profit', 'float', 0),

  total: zodNumber('CustomerOrder.Total', 'float', 0),

  estimatedDeliveryTime: zodDate('CustomerOrder.EstimatedDeliveryTime'),

  estimatedDistance: zodNumber('CustomerOrder.EstimatedDistance', 'float', 0),

  deliveredOn: zodDate('CustomerOrder.DeliveredOn').optional(),

  updatedBy: zodUuid('CustomerOrder.UpdatedBy'),

  updatedAt: zodDate('CustomerOrder.UpdatedAt'),

  cancellationReason: zodString('CustomerOrder.CancellationReason', 1, 500),
});

type CustomerOrderModel = z.infer<typeof CustomerOrderSchema>;

type CustomerOrderReferenceKeys = keyof Pick<
  CustomerOrderModel,
  'customer' | 'updatedBy'
>;

type PopulateField<K extends keyof CustomerOrderModel> = K extends 'customer'
  ? CustomerModel
  : K extends 'updatedBy'
  ? AccountModel
  : never;

type PopulateCustomerOrderFields<K extends CustomerOrderReferenceKeys> = Omit<
  CustomerOrderModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedCustomerOrderModel =
  PopulateCustomerOrderFields<CustomerOrderReferenceKeys>;

export { CustomerOrderSchema };
export type {
  CustomerOrderModel,
  FullyPopulatedCustomerOrderModel,
  PopulateCustomerOrderFields,
};
