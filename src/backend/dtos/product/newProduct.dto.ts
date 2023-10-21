import type { z } from 'zod';

import { ProductSchema } from 'models/product.model';

export const NewProductDtoSchema = ProductSchema.pick({
  name: true,
  description: true,
  shelfLife: true,
  retailPrice: true,
  maxQuantity: true,
  productCategory: true,
  available: true,
});

export type NewProductDto = z.infer<typeof NewProductDtoSchema>;
