import type { z } from 'zod';

import { ProductCategorySchema } from 'models/productCategory.model';

export const UpdateProductCategorySchema = ProductCategorySchema.pick({
  available: true,
  name: true,
});

export type UpdateProductCategoryDto = z.infer<
  typeof UpdateProductCategorySchema
>;
