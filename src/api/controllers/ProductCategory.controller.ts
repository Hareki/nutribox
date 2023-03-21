import { getAllGenerator, getOneGenerator } from './generator.controller';

import ProductCategoryModel from 'api/models/ProductCategory.model';
import type {
  IPopulatedProductCategory,
  IProductCategory,
} from 'api/models/ProductCategory.model/types';

export const getAll = getAllGenerator<IProductCategory>(ProductCategoryModel());
export const getOne = getOneGenerator<
  IProductCategory | IPopulatedProductCategory
>(ProductCategoryModel());

const CategoryController = {
  getAll,
  getOne,
};
export default CategoryController;
