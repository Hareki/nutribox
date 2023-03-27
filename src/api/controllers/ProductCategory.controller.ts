import { getAllGenerator, getOneGenerator } from './generator.controller';

import ProductCategoryModel from 'api/models/ProductCategory.model';
import type {
  IPopulatedProductCategory,
  IProductCategory,
  IProductCategoryDropdown,
} from 'api/models/ProductCategory.model/types';

export const getAll = getAllGenerator<IProductCategory>(ProductCategoryModel());
export const getOne = getOneGenerator<
  IProductCategory | IPopulatedProductCategory
>(ProductCategoryModel());

export const getDropdown = async (): Promise<IProductCategoryDropdown[]> => {
  const categories = await ProductCategoryModel()
    .find()
    .select('name')
    .lean({ virtuals: true })
    .exec();

  return categories;
};

const CategoryController = {
  getAll,
  getOne,
  getDropdown,
};
export default CategoryController;
