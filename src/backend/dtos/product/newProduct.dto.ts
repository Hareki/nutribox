import { z } from 'zod';

import { ProductSchema } from 'models/product.model';
import { ProductCategorySchema } from 'models/productCategory.model';

export const NewProductDtoSchema = ProductSchema.pick({
  name: true,
  description: true,
  shelfLife: true,
  retailPrice: true,
  maxQuantity: true,
  productCategory: true,
  available: true,
});

export const ProductFormSchema = NewProductDtoSchema.omit({
  productCategory: true,
}).and(
  z.object({
    productCategory: z.object(
      {
        id: ProductCategorySchema.shape.id,
        name: ProductCategorySchema.shape.name,
      },
      {
        required_error: 'Product.ProductCategoryId.Required',
        invalid_type_error: 'Product.ProductCategoryId.Required',
      },
    ),
  }),
);

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export type NewProductDto = z.infer<typeof NewProductDtoSchema>;
