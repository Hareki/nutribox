import { z } from 'zod';

import type { CustomerOrderItemModel } from './customerOrderItem.model';
import { zodDate, zodNumber, zodUuid } from './helper';
import type { ImportOrderModel } from './importOder.model';

const ExportOrderSchema = z.object({
  id: zodUuid('ExportOrder.Id'),

  createdAt: zodDate('ExportOrder.CreatedAt'),

  importOrder: zodUuid('ExportOrder.ImportOrderId'),

  customerOrderItem: zodUuid('ExportOrder.CustomerOrderItemId'),

  quantity: zodNumber('ExportOrder.Quantity', 'int', 1, 1_000),
});

type ExportOrderModel = z.infer<typeof ExportOrderSchema>;

type ExportOrderReferenceKeys = keyof Pick<
  ExportOrderModel,
  'importOrder' | 'customerOrderItem'
>;

type PopulateField<K extends keyof ExportOrderModel> = K extends 'importOrder'
  ? ImportOrderModel
  : K extends 'customerOrderItem'
  ? CustomerOrderItemModel
  : never;

type PopulateExportOrderFields<K extends ExportOrderReferenceKeys> = Omit<
  ExportOrderModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedExportOrderModel =
  PopulateExportOrderFields<ExportOrderReferenceKeys>;

export { ExportOrderSchema };
export type {
  ExportOrderModel,
  FullyPopulatedExportOrderModel,
  PopulateExportOrderFields,
};
