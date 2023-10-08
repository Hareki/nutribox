import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const CustomerOrderItemSchema = z.object({
  customerOrderId: zodUuid('CustomerOrderItem.CustomerOrderId'),
  productId: zodUuid('CustomerOrderItem.ProductId'),
  quantity: zodNumber('CustomerOrderItem.Quantity', 'int', 1, 1000),
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
});

type CustomerOrderItemModel = z.infer<typeof CustomerOrderItemSchema>;

export { CustomerOrderItemSchema };
export type { CustomerOrderItemModel };
