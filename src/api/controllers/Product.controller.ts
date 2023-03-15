import {
  getAllGenerator,
  getOneGenerator,
  getTotalGenerator,
} from './base.controller';

import {
  BaseGetOptions,
  buildBaseQuery,
  GetManyDocsOptions,
} from 'api/base/mongoose/baseHandler';
import Product from 'api/models/Product.model';
import { IProduct } from 'api/models/Product.model/types';

interface GetHotProductsOptions extends Omit<BaseGetOptions, 'model'> {}
interface GetNewProductsOptions extends Omit<BaseGetOptions, 'model'> {}

interface GetRelatedProductsParams {
  productId: string;
  categoryId: string;
}
interface GetRelatedProductOptions extends Omit<GetManyDocsOptions, 'model'> {}

export const getAll = getAllGenerator<IProduct>(Product);
export const getOne = getOneGenerator<IProduct>(Product);
export const getTotal = getTotalGenerator(Product);

export const getHotProducts = async ({
  populate,
  lean = true,
  ignoreFields,
}: GetHotProductsOptions) => {
  const query = Product.find({ hot: true });

  buildBaseQuery(query, { populate, lean, ignoreFields });

  const hotProducts = await query.exec();
  return hotProducts;
};

export const getRelatedProducts = async (
  { categoryId, productId }: GetRelatedProductsParams,
  {
    populate,
    lean = true,
    ignoreFields,
    limit = 100,
  }: GetRelatedProductOptions,
) => {
  const query = Product.find({ category: categoryId, _id: { $ne: productId } });
  query.limit(limit);
  buildBaseQuery(query, { populate, lean, ignoreFields });

  const hotProducts = await query.exec();
  return hotProducts;
};

export const getNewProducts = async ({
  populate,
  lean = true,
  ignoreFields,
}: GetNewProductsOptions) => {
  const query = Product.find().sort({ createdAt: -1 });

  buildBaseQuery(query, { populate, lean, ignoreFields });

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
