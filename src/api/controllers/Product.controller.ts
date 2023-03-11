import { getAllGenerator, getOneGenerator } from './base.controller';

import {
  BaseGetOptions,
  buildBaseQuery,
  GetManyDocsOptions,
} from 'api/base/mongoose/baseHandler';
import Product from 'api/models/Product.model';
interface GetHotProductsOptions extends Omit<BaseGetOptions, 'model'> {}

interface GetRelatedProductsParams {
  productId: string;
  categoryId: string;
}
interface GetRelatedProductOptions extends Omit<GetManyDocsOptions, 'model'> {}

export const getAll = getAllGenerator(Product);
export const getOne = getOneGenerator(Product);

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

const ProductController = {
  getAll,
  getOne,
  getHotProducts,
  getRelatedProducts,
};
export default ProductController;
