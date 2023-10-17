import type { CommonProductModel } from '../product/helper';

import type { FullyPopulatedProductCategoryModel } from 'models/productCategory.model';

export type CategoryWithProducts = Omit<
  FullyPopulatedProductCategoryModel,
  'products'
> & {
  products: CommonProductModel[];
};
