import type { NewProductCategoryDto } from 'backend/dtos/categories/newProductCategory.dto';
import type { UpdateProductCategoryDto } from 'backend/dtos/categories/updateProductCategory.dto';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  CATEGORIES_API_STAFF_ROUTE,
  CATEGORY_DETAIL_API_STAFF_ROUTE,
} from 'constants/routes.api.constant';
import { convertToPaginationResult } from 'helpers/pagination.help';
import type { ProductCategoryModel } from 'models/productCategory.model';
import type { GetAllPaginationResult } from 'types/pagination';
import { insertId } from 'utils/middleware.helper';

const getCategories = async (
  page: number,
): Promise<GetAllPaginationResult<ProductCategoryModel>> => {
  const response = await axiosInstance.get<JSSuccess<ProductCategoryModel[]>>(
    CATEGORIES_API_STAFF_ROUTE,
    {
      params: {
        page,
      },
    },
  );

  return convertToPaginationResult(response);
};

const getCategory = async (
  categoryId: string,
): Promise<ProductCategoryModel> => {
  const response = await axiosInstance.get(
    insertId(CATEGORY_DETAIL_API_STAFF_ROUTE, categoryId),
  );
  return response.data.data;
};

const createCategory = async (
  requestBody: NewProductCategoryDto,
): Promise<ProductCategoryModel> => {
  const response = await axiosInstance.post(
    CATEGORIES_API_STAFF_ROUTE,
    requestBody,
  );
  return response.data.data;
};

const updateCategory = async (
  categoryId: string,
  requestBody: UpdateProductCategoryDto,
): Promise<ProductCategoryModel> => {
  const response = await axiosInstance.put(
    insertId(CATEGORY_DETAIL_API_STAFF_ROUTE, categoryId),
    requestBody,
  );
  return response.data.data;
};

const searchCategoriesByName = async (
  searchQuery: string,
): Promise<ProductCategoryModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(CATEGORIES_API_STAFF_ROUTE, {
    params: {
      keyword: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const staffCategoryCaller = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  searchCategoriesByName,
};

export default staffCategoryCaller;
