import { getAllGenerator, getOneGenerator } from './base.controller';

import ProductCategory from 'api/models/ProductCategory.model';
import { IProductCategory } from 'api/models/ProductCategory.model/types';

export const getAll = getAllGenerator<IProductCategory>(ProductCategory);
export const getOne = getOneGenerator<IProductCategory>(ProductCategory);

const ProductController = {
  getAll,
  getOne,
};
export default ProductController;
