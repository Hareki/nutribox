import { z } from 'zod';

import { zodDate, zodString, zodUuid } from './helper';
import type { ProductModel } from './product.model';

const ProductImageSchema = z.object({
  id: zodUuid('ProductImage.Id'),

  createdAt: zodDate('ProductImage.CreatedAt'),

  product: zodUuid('ProductImage.ProductId'),

  imageUrl: zodString('ProductImage.ImageUrl', 1, 500),
});

type ProductImageModel = z.infer<typeof ProductImageSchema>;

type ProductImageReferenceKeys = keyof Pick<ProductImageModel, 'product'>;

type PopulateField<K extends keyof ProductImageModel> = K extends 'product'
  ? ProductModel
  : never;

type PopulateProductImageFields<K extends ProductImageReferenceKeys> = Omit<
  ProductImageModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedProductImageModel =
  PopulateProductImageFields<ProductImageReferenceKeys>;

export { ProductImageSchema };
export type {
  ProductImageModel,
  FullyPopulatedProductImageModel,
  PopulateProductImageFields,
};
