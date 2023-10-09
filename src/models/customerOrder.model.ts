import { z } from 'zod';

import { zodDate, zodNumber, zodString, zodUuid } from './helper';

import { OrderStatus, PaymentMethod } from 'backend/enums/Entities.enum'; // Assuming enums are defined somewhere
import { PHONE_REGEX } from 'constants/regex.constant';

const CustomerOrderSchema = z.object({
  id: zodUuid('CustomerOrder.Id'),

  customer: zodUuid('CustomerOrder.CustomerId').optional(),

  customerOrderItems: z.array(z.string().uuid()),

  createdAt: zodDate('CustomerOrder.CreatedAt'),

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

export { CustomerOrderSchema };
export type { CustomerOrderModel };
