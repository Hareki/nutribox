import { getAllGenerator, getOneGenerator } from './base.controller';

import ProductCategory from 'api/models/ProductCategory.model';

export const getAll = getAllGenerator(ProductCategory);
export const getOne = getOneGenerator(ProductCategory);

const ProductController = {
  getAll,
  getOne,
};
export default ProductController;
