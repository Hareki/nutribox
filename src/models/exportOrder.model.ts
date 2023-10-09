import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const ExportOrderSchema = z.object({
  importOrder: zodUuid('ExportOrder.ImportOrderId'),

  customerOrderItem: zodUuid('ExportOrder.CustomerOrderItemId'),

  quantity: zodNumber('ExportOrder.Quantity', 'int', 1, 1_000),
});

type ExportOrderModel = z.infer<typeof ExportOrderSchema>;

export { ExportOrderSchema };
export type { ExportOrderModel };
