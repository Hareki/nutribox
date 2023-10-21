import type { z } from 'zod';

import {
  ImportDateRefinement1,
  ImportDateRefinement2,
  ImportOrderSchema,
} from 'models/importOder.model';

export const BaseImportProductDtoSchema = ImportOrderSchema.pick({
  supplier: true,
  importQuantity: true,
  importDate: true,
  manufacturingDate: true,
  unitImportPrice: true,
});

export const ImportProductDtoSchema = BaseImportProductDtoSchema.refine(
  ...ImportDateRefinement1,
).refine(...ImportDateRefinement2);

export type ImportProductDto = z.infer<typeof ImportProductDtoSchema>;
