import type {
  IPopulatedCategoryProduct,
  IProduct,
} from 'api/models/Product.model/types';
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

export const getProduct = async (orderId: string): Promise<IProduct> => {
  const response = await axiosInstance.get(`admin/order/detail/${orderId}`);
  return response.data.data;
};

export const updateProduct = async (orderId: string): Promise<IProduct> => {
  const response = await axiosInstance.put(`admin/order/update`, {
    id: orderId,
  });
  return response.data.data;
};

export const addProduct = async (orderId: string): Promise<IProduct> => {
  const response = await axiosInstance.put(`admin/order/update`, {
    id: orderId,
  });
  return response.data.data;
};

const apiCaller = {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
};

export default apiCaller;
