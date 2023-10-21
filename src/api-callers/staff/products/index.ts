import type { ImportProductDto } from 'backend/dtos/product/importProduct.dto';
import type { NewProductDto } from 'backend/dtos/product/newProduct.dto';
import type { UpdateProductDto } from 'backend/dtos/product/updateProduct.dto';
import type {
  CommonProductModel,
  ExtendedCommonProductModel,
} from 'backend/services/product/helper';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CATEGORIES_API_ROUTE,
  IMPORT_PRODUCT_API_STAFF_ROUTE,
  PRODUCTS_API_STAFF_ROUTE,
  PRODUCT_DETAIL_API_ROUTE,
  SUPPLIERS_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import type { ProductModel } from 'models/product.model';
import type { ProductCategoryModel } from 'models/productCategory.model';
import type { SupplierModel } from 'models/supplier.model';
import type { GetAllPaginationResult } from 'types/pagination';
import { AdminMainTablePaginationConstant } from 'utils/constants';
import { insertId } from 'utils/middleware.helper';

const getProducts = async (
  page: number,
): Promise<GetAllPaginationResult<ExtendedCommonProductModel>> => {
  const response = await axiosInstance.get(`admin/product/all`, {
    params: {
      docsPerPage: AdminMainTablePaginationConstant.docsPerPage,
      page,
    },
  });
  return response.data.data;
};

const getProduct = async (
  productId: string,
): Promise<ExtendedCommonProductModel> => {
  const response = await axiosInstance.get(
    insertId(PRODUCT_DETAIL_API_ROUTE, productId),
  );
  const result = response.data.data;
  return result;
};

const getCategoryDropdown = async (): Promise<ProductCategoryModel[]> => {
  const response = await axiosInstance.get(CATEGORIES_API_ROUTE);
  return response.data.data;
};

// const getImportOrders = async (
//   page: number,
//   productId: string,
// ): Promise<GetAllPaginationResult<ImportOrderModel>> => {
//   const response = await axiosInstance.get(`admin/product/expiration-order`, {
//     params: {
//       docsPerPage: AdminSubTablePaginationConstant.docsPerPage,
//       page,
//       productId,
//     },
//   });
//   return response.data.data;
// };

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
    insertId(PRODUCT_DETAIL_API_ROUTE, productId),
    requestBody,
  );
  return response.data.data;
};

const pushImages = async (
  productId: string,
  imageUrls: string[],
): Promise<CommonProductModel> => {
  const response = await axiosInstance.post(
    // `admin/product/${productId}?type=pushImages`,
    insertId(PRODUCT_DETAIL_API_ROUTE, productId),
    {
      imageUrls,
    },
  );
  return response.data.data;
};

const removeImage = async (
  productId: string,
  imageUrl: string,
): Promise<CommonProductModel> => {
  const response = await axiosInstance.patch(
    insertId(PRODUCT_DETAIL_API_ROUTE, productId),
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
  requestBody: ImportProductDto,
): Promise<ProductModel> => {
  const response = await axiosInstance.post(
    IMPORT_PRODUCT_API_STAFF_ROUTE,
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
  // getImportOrders,
  pushImages,
  removeImage,
  getSupplierDropdown,
  importProduct,
  createProduct,
  searchProductsByName,
};

export default apiCaller;
