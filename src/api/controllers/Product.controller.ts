import {
  getAllGenerator,
  getOneGenerator,
  getTotalGenerator,
} from './generator.controller';

import type {
  BaseGetOptions,
  GetManyDocsOptions } from 'api/base/mongoose/baseHandler';
import {
  buildBaseQuery,
} from 'api/base/mongoose/baseHandler';
import ProductModel from 'api/models/Product.model';
import type { IProduct } from 'api/models/Product.model/types';

interface GetHotProductsOptions extends Omit<BaseGetOptions, 'model'> {}
interface GetNewProductsOptions extends Omit<BaseGetOptions, 'model'> {}

interface GetRelatedProductsParams {
  productId: string;
  categoryId: string;
}
interface GetRelatedProductOptions extends Omit<GetManyDocsOptions, 'model'> {}

export const getAll = getAllGenerator<IProduct>(ProductModel());
export const getOne = getOneGenerator<IProduct>(ProductModel());
export const getTotal = getTotalGenerator(ProductModel());

export const getHotProducts = async (
  options?: GetHotProductsOptions,
): Promise<IProduct[]> => {
  const query = ProductModel().find({ hot: true });

  buildBaseQuery(query, {
    populate: options.populate,
    ignoreFields: options.ignoreFields,
  });

  const hotProducts = await query.exec();
  return hotProducts;
};

export const getRelatedProducts = async (
  { categoryId, productId }: GetRelatedProductsParams,
  { populate, ignoreFields, limit = 100 }: GetRelatedProductOptions,
): Promise<IProduct[]> => {
  const query = ProductModel().find({
    category: categoryId,
    _id: { $ne: productId },
  });
  query.limit(limit);
  buildBaseQuery(query, { populate, ignoreFields });

  const hotProducts = await query.exec();
  return hotProducts;
};

export const getNewProducts = async (
  options?: GetNewProductsOptions,
): Promise<IProduct[]> => {
  const query = ProductModel().find().sort({ createdAt: -1 });

  buildBaseQuery(query, {
    populate: options.populate,
    ignoreFields: options.ignoreFields,
  });

  const relatedProducts = await query.exec();
  return relatedProducts;
};

const ProductController = {
  getAll,
  getOne,
  getTotal,
  getHotProducts,
  getRelatedProducts,
  getNewProducts,
};
export default ProductController;
