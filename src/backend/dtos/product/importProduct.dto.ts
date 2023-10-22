import { z } from 'zod';

import {
  DateRefinement1,
  DateRefinement2,
  DateRefinement3,
  ImportOrderSchema,
} from 'models/importOder.model';
import { SupplierSchema } from 'models/supplier.model';

export const BaseImportProductDtoSchema = ImportOrderSchema.pick({
  supplier: true,
  importQuantity: true,
  importDate: true,
  manufacturingDate: true,
  unitImportPrice: true,
});

export const ImportProductDtoSchema = BaseImportProductDtoSchema.refine(
  ...DateRefinement1,
)
  .refine(...DateRefinement2)
  .refine(...DateRefinement3);

export const ImportProductFormSchema = BaseImportProductDtoSchema.omit({
  supplier: true,
})
  .refine(...DateRefinement3)
  .and(
    z.object({
      supplier: z.object(
        {
          id: SupplierSchema.shape.id,
          name: SupplierSchema.shape.name,
        },
        {
          required_error: 'ImportOrder.SupplierId.Required',
          invalid_type_error: 'ImportOrder.SupplierId.Required',
        },
      ),
    }),
  );

export type ImportProductFormValues = z.infer<typeof ImportProductFormSchema>;

export type ImportProductDto = z.infer<typeof ImportProductDtoSchema>;
