import { z } from 'zod';

import type { ExportOrderModel } from './exportOrder.model';
import {
  zodDate,
  type RefinementParameters,
  zodNumber,
  zodUuid,
} from './helper';
import type { ProductModel } from './product.model';
import type { SupplierModel } from './supplier.model';

import { isDateTimeAfter } from 'utils/date.helper';

const ImportOrderSchema = z.object({
  id: zodUuid('ImportOrder.Id'),

  createdAt: zodDate('ImportOrder.CreatedAt'),

  product: zodUuid('ImportOrder.ProductId'),

  supplier: zodUuid('ImportOrder.SupplierId'),

  exportOrders: z.array(z.string().uuid()).optional(),

  importDate: zodDate('ImportOrder.ImportDate'),

  manufacturingDate: zodDate('ImportOrder.ManufacturingDate'),

  expirationDate: zodDate('ImportOrder.ExpirationDate'),

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
    !isDateTimeAfter(data.importDate, data.expirationDate),
  {
    message: 'ImportOrder.ImportDate.BeforeOrEqual.ExpirationDate',
    path: ['defaultImportPrice'],
  },
];

const ImportDateRefinement2: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) =>
    !isDateTimeAfter(data.manufacturingDate, data.expirationDate),
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

type ImportOrderReferenceKeys = keyof Pick<
  ImportOrderModel,
  'product' | 'supplier' | 'exportOrders'
>;

type PopulateField<K extends keyof ImportOrderModel> = K extends 'product'
  ? ProductModel
  : K extends 'supplier'
  ? SupplierModel
  : K extends 'exportOrders'
  ? ExportOrderModel[]
  : never;

type PopulateImportOrderFields<K extends ImportOrderReferenceKeys> = Omit<
  ImportOrderModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedImportOrderModel =
  PopulateImportOrderFields<ImportOrderReferenceKeys>;

export { ImportOrderSchema, getRefinedImportOrderSchema };
export type {
  ImportOrderModel,
  FullyPopulatedImportOrderModel,
  PopulateImportOrderFields,
};
