import { z } from 'zod';

import {
  zodDate,
  type RefinementParameters,
  zodNumber,
  zodUuid,
} from './helper';

import { isBeforeOrEqual } from 'utils/date.helper';

const ImportOrderSchema = z.object({
  id: zodUuid('ImportOrder.Id'),
  createdAt: zodDate('ImportOrder.CreatedAt'),
  importDate: zodDate('ImportOrder.ImportDate'),
  manufacturingDate: zodDate('ImportOrder.ManufacturingDate'),
  expirationDate: zodDate('ImportOrder.ExpirationDate'),

  productId: zodUuid('ImportOrder.ProductId'),
  supplierId: zodUuid('ImportOrder.SupplierId'),
  importQuantity: zodNumber('ImportOrder.ImportQuantity', 'int', 1, 1_000),
  unitImportPrice: zodNumber(
    'ImportOrder.UnitImportPrice',
    'float',
    0,
    10_000_000,
  ),
  remainingQuantity: zodNumber(
    'ImportOrder.RemainingQuantity',
    'int',
    0,
    1_000,
  ),
});

type ImportOrderModel = z.infer<typeof ImportOrderSchema>;

const ImportDateRefinement1: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) =>
    isBeforeOrEqual(data.importDate, data.expirationDate),
  {
    message: 'ImportOrder.ImportDate.BeforeOrEqual.ExpirationDate',
    path: ['defaultImportPrice'],
  },
];

const ImportDateRefinement2: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) =>
    isBeforeOrEqual(data.manufacturingDate, data.expirationDate),
  {
    message: 'ImportOrder.ManufacturingDate.BeforeOrEqual.ExpirationDate',
    path: ['defaultImportPrice'],
  },
];

const ImportQuantityRefinement: RefinementParameters<ImportOrderModel> = [
  (data) => data.importQuantity <= data.remainingQuantity,
  {
    message: 'ImportOrder.ImportQuantity.LessThan.RemainingQuantity',
    path: ['defaultImportPrice'],
  },
];

const getRefinedImportOrderSchema = (schema: z.Schema<any>) =>
  schema
    .refine(...ImportDateRefinement1)
    .refine(...ImportDateRefinement2)
    .refine(...ImportQuantityRefinement);

export { ImportOrderSchema, getRefinedImportOrderSchema };
export type { ImportOrderModel };
