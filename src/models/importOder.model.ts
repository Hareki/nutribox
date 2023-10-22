import { addDays, isAfter } from 'date-fns';
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

import { isDateTimeAfterOrEqual } from 'utils/date.helper';

const ImportOrderSchema = z.object({
  id: zodUuid('ImportOrder.Id'),

  createdAt: zodDate('ImportOrder.CreatedAt'),

  product: zodUuid('ImportOrder.ProductId'),

  supplier: zodUuid('ImportOrder.SupplierId'),

  exportOrders: z.array(z.string().uuid()).optional(),

  importDate: zodDate(
    'ImportOrder.ImportDate',
    addDays(new Date(), -3),
    new Date(),
  ),

  manufacturingDate: zodDate(
    'ImportOrder.ManufacturingDate',
    undefined,
    new Date(),
  ),

  expirationDate: zodDate('ImportOrder.ExpirationDate'),

  importQuantity: zodNumber('ImportOrder.ImportQuantity', 'int', 1, 1_000),

  unitImportPrice: zodNumber(
    'ImportOrder.UnitImportPrice',
    'float',
    1,
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

export const DateRefinement1: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) =>
    isDateTimeAfterOrEqual(data.expirationDate, data.importDate),
  {
    message: 'ImportOrder.ImportDate.BeforeOrEqual.ExpirationDate',
    path: ['importDate'],
  },
];

export const DateRefinement2: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) =>
    isDateTimeAfterOrEqual(data.expirationDate, data.manufacturingDate),
  {
    message: 'ImportOrder.ManufacturingDate.BeforeOrEqual.ExpirationDate',
    path: ['manufacturingDate'],
  },
];

export const DateRefinement3: RefinementParameters<ImportOrderModel> = [
  (data: ImportOrderModel) => {
    return isDateTimeAfterOrEqual(data.importDate, data.manufacturingDate);
  },
  {
    message: 'ImportOrder.ManufacturingDate.BeforeOrEqual.ImportDate',
    path: ['importDate'],
  },
];

export const ImportQuantityRefinement: RefinementParameters<ImportOrderModel> =
  [
    (data) => data.importQuantity <= data.remainingQuantity,
    {
      message: 'ImportOrder.ImportQuantity.LessThan.RemainingQuantity',
      path: ['importQuantity'],
    },
  ];

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

export { ImportOrderSchema };
export type {
  ImportOrderModel,
  FullyPopulatedImportOrderModel,
  PopulateImportOrderFields,
};
