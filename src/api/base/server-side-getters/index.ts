import ProductController from 'api/controllers/Product.controller';
import ProductCategoryController from 'api/controllers/ProductCategory.controller';
import { populateUnexpiredExpiration } from 'api/helpers/model.helper';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import type { IUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import type { GetPaginationResult } from 'api/types/pagination.type';

export async function getAllCategories() {
  const result: IProductCategory[] = await ProductCategoryController.getAll();
  return result;
}

export const getProduct = async (id: string): Promise<IUpeProduct> => {
  const product = await ProductController.getOne({
    id,
  });
  const populatedProduct = (await populateUnexpiredExpiration([product]))[0];

  return populatedProduct;
};

export const getAllProducts = async (
  docsPerPage: string,
  page: string,
  populate: string[],
): Promise<GetPaginationResult<IUpeProduct>> => {
  const totalDocs = await ProductController.getTotal();

  const { skip, limit, nextPageNum } = getPaginationParams({
    docsPerPage: docsPerPage,
    page: page,
    totalDocs,
  });

  const products = await ProductController.getAll({
    populate,
    skip,
    limit,
  });

  const populatedProducts = await populateUnexpiredExpiration(products);

  const result = {
    nextPageNum,
    totalDocs,
    docs: populatedProducts,
  };

  return result;
};

export const getHotProducts = async (): Promise<IUpeProduct[]> => {
  const products: IProduct[] = await ProductController.getHotProducts();
  const populatedProducts = await populateUnexpiredExpiration(products);

  return populatedProducts;
};

export const getNewProducts = async (): Promise<IUpeProduct[]> => {
  const products: IProduct[] = await ProductController.getNewProducts();

  const populatedProducts = await populateUnexpiredExpiration(products);
  return populatedProducts;
};

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<IUpeProduct[]> {
  const products: IProduct[] = await ProductController.getRelatedProducts(
    { productId: productId, categoryId: categoryId },
    { limit: 4 },
  );

  const populatedProducts = await populateUnexpiredExpiration(products);
  return populatedProducts;
}

export async function getProductSlugs() {
  const products: { name: string; slug: string }[] =
    await ProductController.getAll({
      includeFields: ['name', 'slug'],
    });

  const slugs = products.map((product) => product.slug);
  return slugs;
}
