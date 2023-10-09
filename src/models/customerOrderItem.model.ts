import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const CustomerOrderItemSchema = z.object({
  customerOrder: zodUuid('CustomerOrderItem.CustomerOrderId'),

  product: zodUuid('CustomerOrderItem.ProductId'),

  unitRetailPrice: zodNumber(
    'CustomerOrderItem.UnitRetailPrice',
    'float',
    0,
    10_000_000,
  ),

  unitImportPrice: zodNumber(
    'CustomerOrderItem.UnitImportPrice',
    'float',
    0,
    10_000_000,
  ),

  quantity: zodNumber('CustomerOrderItem.Quantity', 'int', 1, 1000),

  exportOrders: z.array(z.string().uuid()).optional(),
});

type CustomerOrderItemModel = z.infer<typeof CustomerOrderItemSchema>;

export { CustomerOrderItemSchema };
export type { CustomerOrderItemModel };
