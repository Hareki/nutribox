import ProductController from 'api/controllers/Product.controller';
import ProductCategoryController from 'api/controllers/ProductCategory.controller';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import type { IProduct } from 'api/models/Product.model/types';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';

export async function getAllCategories(isPopulate: boolean) {
  const result: IProductCategory[] = await ProductCategoryController.getAll({
    populate: isPopulate ? ['products'] : undefined,
  });
  return result;
}

export async function getProduct(id: string, isPopulate: boolean) {
  return await ProductController.getOne({
    id,
    populate: isPopulate ? ['category'] : undefined,
  });
}

export async function getAllProducts(
  docsPerPage: string,
  page: string,
  isPopulate: boolean,
) {
  const totalDocs = await ProductController.getTotal();

  const { skip, limit, nextPageNum } = getPaginationParams({
    docsPerPage: docsPerPage,
    page: page,
    totalDocs,
  });

  const products = await ProductController.getAll({
    populate: isPopulate ? ['category'] : undefined,
    skip,
    limit,
  });

  const result = {
    nextPageNum,
    totalDocs,
    docs: products,
  };
  return result;
}

export async function getHotProducts(isPopulate: boolean) {
  const result: IProduct[] = await ProductController.getHotProducts({
    populate: isPopulate ? ['category'] : undefined,
  });
  return result;
}

export async function getNewProducts(isPopulate: boolean) {
  const result: IProduct[] = await ProductController.getNewProducts({
    populate: isPopulate ? ['category'] : undefined,
  });
  return result;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
) {
  const result: IProduct[] = await ProductController.getRelatedProducts(
    { productId: productId, categoryId: categoryId },
    { limit: 4 },
  );
  return result;
}

export async function getProductSlugs() {
  const products: { name: string; slug: string }[] =
    await ProductController.getAll({
      includeFields: ['name', 'slug'],
    });

  const slugs = products.map((product) => product.slug);
  return slugs;
}
