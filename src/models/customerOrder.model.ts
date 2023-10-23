import { z } from 'zod';

import type { AccountModel } from './account.model';
import type { CustomerModel } from './customer.model';
import type { CustomerOrderItemModel } from './customerOrderItem.model';
import { zodDate, zodNumber, zodPhone, zodString, zodUuid } from './helper';

import { OrderStatus, PaymentMethod } from 'backend/enums/entities.enum'; // Assuming enums are defined somewhere

const CustomerOrderSchema = z.object({
  id: zodUuid('CustomerOrder.Id'),

  createdAt: zodDate('CustomerOrder.CreatedAt'),

  customer: zodUuid('CustomerOrder.CustomerId').optional(),

  customerOrderItems: z.array(z.string().uuid()),

  status: z.nativeEnum(OrderStatus, {
    required_error: 'CustomerOrder.Status.Required',
  }),

  phone: zodPhone('CustomerOrder.Phone'),

  paidOnlineVia: z.nativeEnum(PaymentMethod).optional(),

  provinceCode: zodNumber('CustomerAddress.ProvinceCode', 'int', 1, 10_000),

  districtCode: zodNumber('CustomerAddress.DistrictCode', 'int', 1, 10_000),

  wardCode: zodNumber('CustomerAddress.WardCode', 'int', 1, 100_000),

  provinceName: zodString('CustomerAddress.ProvinceName', 1, 50),

  districtName: zodString('CustomerAddress.ProvinceName', 1, 50),

  wardName: zodString('CustomerAddress.ProvinceName', 1, 50),

  streetAddress: zodString('CustomerOrder.StreetAddress', 1, 100),

  note: zodString('CustomerOrder.Note', 0, 500).optional(),

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
  'customer' | 'updatedBy' | 'customerOrderItems'
>;

type PopulateField<K extends keyof CustomerOrderModel> = K extends 'customer'
  ? CustomerModel
  : K extends 'updatedBy'
  ? AccountModel
  : K extends 'customerOrderItems'
  ? CustomerOrderItemModel[]
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
