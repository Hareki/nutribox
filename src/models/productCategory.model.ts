import { z } from 'zod';

import { zodString, zodUuid } from './helper';

const ProductCategorySchema = z.object({
  id: zodUuid('ProductCategory.Id'),
  available: z.boolean(),
  name: zodString('ProductCategory.Name', 3, 50),
});

type ProductCategoryModel = z.infer<typeof ProductCategorySchema>;

export { ProductCategorySchema };
export type { ProductCategoryModel };
