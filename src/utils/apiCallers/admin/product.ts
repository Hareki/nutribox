import type { UpdateProductInfoRb } from '../../../../pages/api/admin/product/[id]';
import type { ExpirationOrder } from '../../../../pages/api/admin/product/expiration-order';
import type { ImportProductRb } from '../../../../pages/api/admin/product/import-product';

import type { ICdsUpeProduct, IProduct } from 'api/models/Product.model/types';
import type { IProductCategoryDropdown } from 'api/models/ProductCategory.model/types';
import type { ISupplierDropdown } from 'api/models/Supplier.model/types';
import type { GetAllPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';
import {
  AdminMainTablePaginationConstant,
  AdminSubTablePaginationConstant,
} from 'utils/constants';

const getProducts = async (
  page: number,
): Promise<GetAllPaginationResult<ICdsUpeProduct>> => {
  const response = await axiosInstance.get(`admin/product/all`, {
    params: {
      docsPerPage: AdminMainTablePaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

const getProduct = async (productId: string): Promise<ICdsUpeProduct> => {
  const response = await axiosInstance.get(`admin/product/${productId}`);
  const result = response.data.data;
  // console.log('file: product.ts:33 - getProduct - result:', result);
  return result;
};

const addProduct = async (productId: string): Promise<IProduct> => {
  const response = await axiosInstance.put(`admin/product/update`, {
    id: productId,
  });
  return response.data.data;
};

const getCategoryDropdown = async (): Promise<IProductCategoryDropdown[]> => {
  const response = await axiosInstance.get(`admin/product/category-dropdown`);
  return response.data.data;
};

const getExpirationOrders = async (
  page: number,
  productId: string,
): Promise<GetAllPaginationResult<ExpirationOrder>> => {
  const response = await axiosInstance.get(`admin/product/expiration-order`, {
    params: {
      docsPerPage: AdminSubTablePaginationConstant.docsPerPage,
      page,
      productId: productId,
    },
  });
  return response.data.data;
};

const updateProduct = async (
  productId: string,
  requestBody: UpdateProductInfoRb,
): Promise<IProduct> => {
  const response = await axiosInstance.put(
    `admin/product/${productId}?type=updateInfo`,
    requestBody,
  );
  return response.data.data;
};

const pushImageUrls = async (
  productId: string,
  imageUrls: string[],
): Promise<IProduct> => {
  const response = await axiosInstance.put(
    `admin/product/${productId}?type=pushImages`,
    {
      imageUrls,
    },
  );
  return response.data.data;
};

const deleteImageUrl = async (
  productId: string,
  imageUrl: string,
): Promise<IProduct> => {
  const response = await axiosInstance.put(
    `admin/product/${productId}?type=deleteImage`,
    {
      imageUrl,
    },
  );
  return response.data.data;
};

const getSupplierDropdown = async (): Promise<ISupplierDropdown[]> => {
  const response = await axiosInstance.get(`admin/product/supplier-dropdown`);
  return response.data.data;
};

const importProduct = async (
  requestBody: ImportProductRb,
): Promise<IProduct> => {
  const response = await axiosInstance.put(
    `admin/product/import-product`,
    requestBody,
  );
  return response.data.data;
};

const apiCaller = {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
  getCategoryDropdown,
  getExpirationOrders,
  pushImageUrls,
  deleteImageUrl,
  getSupplierDropdown,
  importProduct,
};

export default apiCaller;
