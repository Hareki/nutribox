import { getAllGenerator, getOneGenerator } from './generator.controller';

import ProductCategoryModel from 'api/models/ProductCategory.model';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';

export const getAll = getAllGenerator<IProductCategory>(ProductCategoryModel());
export const getOne = getOneGenerator<IProductCategory>(ProductCategoryModel());

const ProductController = {
  getAll,
  getOne,
};
export default ProductController;
