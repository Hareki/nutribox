import { getAllGenerator, getOneGenerator } from './base.controller';

import Product from 'api/models/Product.model';

export const getAll = getAllGenerator(Product);
export const getOne = getOneGenerator(Product);

const ProductController = {
  getAll,
  getOne,
};
export default ProductController;
