import { z } from 'zod';

import { zodNumber, zodUuid } from './helper';

const ExportOrderSchema = z.object({
  importOrderId: zodUuid('ExportOrder.ImportOrderId'),
  customerOrderItemId: zodUuid('ExportOrder.CustomerOrderItemId'),
  quantity: zodNumber('ExportOrder.Quantity', 'int', 1, 1000),
});

type ExportOrderModel = z.infer<typeof ExportOrderSchema>;

export { ExportOrderSchema };
export type { ExportOrderModel };
