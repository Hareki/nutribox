import AccountController from 'api/controllers/Account.controller';
import ProductController from 'api/controllers/Product.controller';
import ProductCategoryController from 'api/controllers/ProductCategory.controller';
import StoreController from 'api/controllers/Store.controller';
import { populateAscUnexpiredExpiration } from 'api/helpers/model.helper';
import { getPaginationParams } from 'api/helpers/pagination.helpers';
import AccountModel from 'api/models/Account.model';
import type { IUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import type { IStore } from 'api/models/Store.model/types';
import type { GetInfinitePaginationResult } from 'api/types/pagination.type';
import { allCategory } from 'utils/apiCallers';

export async function getAllCategories() {
  const result: IProductCategory[] = await ProductCategoryController.getAll();
  result.unshift(allCategory);
  return result;
}

export const getProduct = async (id: string): Promise<IUpeProduct> => {
  const product = await ProductController.getOne({
    id,
  });
  const populatedProduct = (await populateAscUnexpiredExpiration([product]))[0];

  return populatedProduct;
};

// FIXME: Should be refactored to use processPaginationParams instead
export const getAllProducts = async (
  docsPerPage: string,
  page: string,
  populate: string[] = [],
): Promise<GetInfinitePaginationResult<IUpeProduct>> => {
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
    filter: { available: true },
  });

  const populatedProducts = await populateAscUnexpiredExpiration(products);

  const result = {
    nextPageNum,
    totalDocs,
    docs: populatedProducts,
  };

  return result;
};

export const getHotProducts = async (): Promise<IUpeProduct[]> => {
  const products: IProduct[] = await ProductController.getHotProducts();
  const populatedProducts = await populateAscUnexpiredExpiration(products);

  return populatedProducts;
};

export const getNewProducts = async (): Promise<IUpeProduct[]> => {
  const products: IProduct[] = await ProductController.getNewProducts();

  const populatedProducts = await populateAscUnexpiredExpiration(products);
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

  const populatedProducts = await populateAscUnexpiredExpiration(products);
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

export async function getAccount(accountId: string) {
  const account = await AccountController.getOne({
    id: accountId,
  });

  return account;
}

export const getStore = async (id: string): Promise<IStore> => {
  const result = await StoreController.getOne({ id });
  return result;
};

export const getUserByToken = async (
  token: string,
  type: 'verification' | 'forgotPassword',
) => {
  if (!token) {
    return null;
  }

  const user = await AccountModel().findOne({
    [`${type}Token`]: token,
    [`${type}Expires`]: { $gt: Date.now() },
  });

  return user;
};

export const verifyAccount = async (token: string) => {
  const user = await getUserByToken(token, 'verification');

  if (user) {
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return true;
  }
  return false;
};
