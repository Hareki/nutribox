import type { CategoryWithProducts } from 'backend/services/category/helper';
import type { CommonProductModel } from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CATEGORIES_API_ROUTE,
  CATEGORY_DETAIL_API_ROUTE,
  HOT_PRODUCTS_API_ROUTE,
  NEW_PRODUCTS_API_ROUTE,
  PRODUCTS_API_ROUTE,
} from 'constants/routes.api.constant';
import type { ProductCategoryModel } from 'models/productCategory.model';
import type { GetInfinitePaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

export const allCategory: ProductCategoryModel = {
  available: true,
  createdAt: new Date(),
  id: '',
  name: 'Tất cả',
  products: [],
};

const getAllCategories = async (): Promise<ProductCategoryModel[]> => {
  const response =
    await axiosInstance.get<JSSuccess<ProductCategoryModel[]>>(
      CATEGORIES_API_ROUTE,
    );
  return [allCategory, ...response.data.data];
};

const getAllProducts = async (
  page: number,
): Promise<GetInfinitePaginationResult<CommonProductModel>> => {
  const response = await axiosInstance.get<JSSuccess<CommonProductModel[]>>(
    PRODUCTS_API_ROUTE,
    {
      params: {
        page,
      },
    },
  );
  const nextPageNum = response.headers['x-next-page'];
  console.log('file: index.ts:47 - nextPageNum:', nextPageNum);
  const totalDocs = response.headers['x-total-count'];
  console.log('file: index.ts:49 - totalDocs:', totalDocs);

  return {
    docs: response.data.data,
    nextPageNum,
    totalDocs,
  };
};

const getCategoryWithProducts = async (
  categoryId: string,
): Promise<CategoryWithProducts> => {
  const response = await axiosInstance.get<JSSuccess<CategoryWithProducts>>(
    insertId(CATEGORY_DETAIL_API_ROUTE, categoryId),
  );
  return response.data.data;
};

const getHotProducts = async (): Promise<CommonProductModel[]> => {
  const response = await axiosInstance.get<JSSuccess<CommonProductModel[]>>(
    HOT_PRODUCTS_API_ROUTE,
  );
  return response.data.data;
};

const getNewProducts = async (): Promise<CommonProductModel[]> => {
  const response = await axiosInstance.get<JSSuccess<CommonProductModel[]>>(
    NEW_PRODUCTS_API_ROUTE,
  );
  return response.data.data;
};

const homePageCaller = {
  getAllProducts,
  getHotProducts,
  getAllCategories,
  getCategoryWithProducts,
  getNewProducts,
};

export default homePageCaller;
