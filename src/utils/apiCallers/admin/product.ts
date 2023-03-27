import type { UpdateProductInfoRb } from '../../../../pages/api/admin/product/[id]';

import type {
  IPopulatedCategoryProduct,
  IProduct,
} from 'api/models/Product.model/types';
import type { IProductCategoryDropdown } from 'api/models/ProductCategory.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import { AdminPaginationConstant } from 'utils/constants';

export const getProducts = async (
  page: number,
): Promise<GetAllPaginationResult<IPopulatedCategoryProduct>> => {
  const response = await axiosInstance.get(`admin/product/all`, {
    params: {
      docsPerPage: AdminPaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

export const getProduct = async (
  productId: string,
): Promise<IPopulatedCategoryProduct> => {
  const response = await axiosInstance.get(`admin/product/${productId}`);
  return response.data.data;
};

export const updateProduct = async (
  productId: string,
  requestBody: UpdateProductInfoRb,
): Promise<IProduct> => {
  const response = await axiosInstance.put(
    `admin/product/${productId}`,
    requestBody,
  );
  return response.data.data;
};

export const addProduct = async (productId: string): Promise<IProduct> => {
  const response = await axiosInstance.put(`admin/product/update`, {
    id: productId,
  });
  return response.data.data;
};

export const getDropdown = async (): Promise<IProductCategoryDropdown[]> => {
  const response = await axiosInstance.get(`admin/product/category-dropdown`);
  return response.data.data;
};

const apiCaller = {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
  getDropdown,
};

export default apiCaller;
