import { z } from 'zod';

import { zodString, zodUuid } from './helper';
import type { ProductModel } from './product.model';

const ProductCategorySchema = z.object({
  id: zodUuid('ProductCategory.Id'),

  available: z.boolean(),

  name: zodString('ProductCategory.Name', 3, 50),

  products: z.array(z.string().uuid()).optional(),
});

type ProductCategoryModel = z.infer<typeof ProductCategorySchema>;

type ProductCategoryReferenceKeys = keyof Pick<
  ProductCategoryModel,
  'products'
>;

type PopulateField<K extends keyof ProductCategoryModel> = K extends 'products'
  ? ProductModel[]
  : never;

type PopulateProductCategoryFields<K extends ProductCategoryReferenceKeys> =
  Omit<ProductCategoryModel, K> & {
    [P in K]: PopulateField<P>;
  };

type FullyPopulatedProductCategoryModel =
  PopulateProductCategoryFields<ProductCategoryReferenceKeys>;

export { ProductCategorySchema };
export type {
  ProductCategoryModel,
  FullyPopulatedProductCategoryModel,
  PopulateProductCategoryFields,
};
