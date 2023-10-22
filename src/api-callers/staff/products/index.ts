import type { ImportProductDto } from 'backend/dtos/product/importProduct.dto';
import type { NewProductDto } from 'backend/dtos/product/newProduct.dto';
import type { UpdateProductDto } from 'backend/dtos/product/updateProduct.dto';
import type {
  CommonProductModel,
  ExtendedCommonProductModel,
} from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CATEGORIES_API_ROUTE,
  IMPORT_ORDERS_API_STAFF_ROUTE,
  IMPORT_PRODUCT_API_STAFF_ROUTE,
  PRODUCTS_API_STAFF_ROUTE,
  PRODUCT_DETAIL_API_STAFF_ROUTE,
  SUPPLIERS_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type { ImportOrderModel } from 'models/importOder.model';
import type { ProductModel } from 'models/product.model';
import type { ProductCategoryModel } from 'models/productCategory.model';
import type { SupplierModel } from 'models/supplier.model';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getProducts = async (
  page: number,
): Promise<GetAllPaginationResult<ExtendedCommonProductModel>> => {
  const response = await axiosInstance.get<
    JSSuccess<ExtendedCommonProductModel[]>
  >(PRODUCTS_API_STAFF_ROUTE, {
    params: {
      page,
    },
  });

  return convertToPaginationResult(response);
};

const getProduct = async (
  productId: string,
): Promise<ExtendedCommonProductModel> => {
  const response = await axiosInstance.get(
    insertId(PRODUCT_DETAIL_API_STAFF_ROUTE, productId),
  );
  const result = response.data.data;
  return result;
};

const getCategoryDropdown = async (): Promise<ProductCategoryModel[]> => {
  const response = await axiosInstance.get(CATEGORIES_API_ROUTE);
  return response.data.data;
};

const getImportOrders = async (
  page: number,
  productId: string,
): Promise<GetAllPaginationResult<ImportOrderModel>> => {
  const response = await axiosInstance.get(IMPORT_ORDERS_API_STAFF_ROUTE, {
    params: {
      page,
      productId,
    },
  });
  return convertToPaginationResult(response);
};

const createProduct = async (
  requestBody: NewProductDto,
): Promise<ExtendedCommonProductModel> => {
  const response = await axiosInstance.post(
    PRODUCTS_API_STAFF_ROUTE,
    requestBody,
  );
  return response.data.data;
};
const updateProduct = async (
  productId: string,
  requestBody: UpdateProductDto,
): Promise<ProductModel> => {
  const response = await axiosInstance.put(
    insertId(PRODUCT_DETAIL_API_STAFF_ROUTE, productId),
    requestBody,
  );
  return response.data.data;
};

const pushImages = async (
  productId: string,
  productImages: string[],
): Promise<CommonProductModel> => {
  const response = await axiosInstance.post(
    // `admin/product/${productId}?type=pushImages`,
    insertId(PRODUCT_DETAIL_API_STAFF_ROUTE, productId),
    {
      productImages,
    },
  );
  return response.data.data;
};

const removeImage = async (
  productId: string,
  imageUrl: string,
): Promise<CommonProductModel> => {
  const response = await axiosInstance.patch(
    insertId(PRODUCT_DETAIL_API_STAFF_ROUTE, productId),
    {
      imageUrl,
    },
  );
  return response.data.data;
};

const getSupplierDropdown = async (): Promise<SupplierModel[]> => {
  const response = await axiosInstance.get(SUPPLIERS_API_STAFF_ROUTE, {
    params: {
      type: 'dropdown',
    },
  });
  return response.data.data;
};

const importProduct = async (
  productId: string,
  requestBody: ImportProductDto,
): Promise<ProductModel> => {
  const response = await axiosInstance.post(
    insertId(IMPORT_PRODUCT_API_STAFF_ROUTE, productId),
    requestBody,
  );
  return response.data.data;
};

const searchProductsByName = async (
  searchQuery: string,
): Promise<ExtendedCommonProductModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(PRODUCTS_API_STAFF_ROUTE, {
    params: {
      keyword: searchQuery,
    },
  });

  return response.data.data;
};

const apiCaller = {
  getProducts,
  getProduct,
  updateProduct,
  getCategoryDropdown,
  getImportOrders,
  pushImages,
  removeImage,
  getSupplierDropdown,
  importProduct,
  createProduct,
  searchProductsByName,
};

export default apiCaller;
