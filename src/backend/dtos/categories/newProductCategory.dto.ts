import type { z } from 'zod';

import { ProductCategorySchema } from 'models/productCategory.model';

export const NewProductCategoryDtoSchema = ProductCategorySchema.pick({
  available: true,
  name: true,
});

export type NewProductCategoryDto = z.infer<typeof NewProductCategoryDtoSchema>;
