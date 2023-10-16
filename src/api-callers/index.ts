import type { CommonProductModel } from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CATEGORIES_API_ROUTE,
  HOT_PRODUCTS_API_ROUTE,
  NEW_PRODUCTS_API_ROUTE,
  PRODUCTS_API_ROUTE,
} from 'constants/routes.api.constant';
import type {
  FullyPopulatedProductCategoryModel,
  ProductCategoryModel,
} from 'models/productCategory.model';

export const allCategory: ProductCategoryModel = {
  id: '',
  createdAt: new Date(),
  name: 'Tất cả',
  products: [],
  available: true,
};

const getAllCategories = async (): Promise<ProductCategoryModel[]> => {
  const response =
    await axiosInstance.get<JSSuccess<ProductCategoryModel[]>>(
      CATEGORIES_API_ROUTE,
    );
  return response.data.data;
};

const getAllProducts = async (page: number): Promise<CommonProductModel[]> => {
  const response = await axiosInstance.get<JSSuccess<CommonProductModel[]>>(
    PRODUCTS_API_ROUTE,
    {
      params: {
        page,
      },
    },
  );
  return response.data.data;
};

const getCategoryWithProducts = async (
  categoryId: string,
): Promise<FullyPopulatedProductCategoryModel> => {
  const response = await axiosInstance.get<
    JSSuccess<FullyPopulatedProductCategoryModel>
  >(PRODUCTS_API_ROUTE, {
    params: {
      category: categoryId,
    },
  });
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
