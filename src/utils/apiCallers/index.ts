import { ProfileInfiniteProductConstant } from './../constants';

import type { IUpeProduct } from 'api/models/Product.model/types';
import type {
  IProductCategory,
  IPopulatedUpeProductCategory,
} from 'api/models/ProductCategory.model/types';
import type { GetInfinitePaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'constants/axiosFe.constant';

export const allCategory: IProductCategory = {
  id: '',
  name: 'Tất cả',
  slug: '',
  products: [],
};

const getAllCategories = async (): Promise<IProductCategory[]> => {
  const response = await axiosInstance.get('/category/all');
  return response.data.data;
};

const getAllProducts = async (
  pageNumInput: number,
): Promise<GetInfinitePaginationResult<IUpeProduct>> => {
  let pageNum: number, docsPerPage: number;
  if (!pageNumInput) {
    pageNum = 1;
    docsPerPage = ProfileInfiniteProductConstant.infiniteDocsPerPage;
  } else {
    pageNum = pageNumInput;
    docsPerPage = ProfileInfiniteProductConstant.docsPerPage;
  }

  if (docsPerPage === ProfileInfiniteProductConstant.infiniteDocsPerPage)
    console.warn('WARNING: docsPerPage is infiniteDocsPerPage');

  const response = await axiosInstance.get('/product/all', {
    params: {
      page: pageNum,
      docsPerPage: docsPerPage,
    },
  });
  return response.data.data;
};

const getHotProducts = async (): Promise<IUpeProduct[]> => {
  const response = await axiosInstance.get('/product/hot');
  return response.data.data;
};

const getCategoryWithProducts = async (
  categoryId: string,
): Promise<IPopulatedUpeProductCategory> => {
  const response = await axiosInstance.get(`/category/${categoryId}`);
  return response.data.data;
};

const getNewProducts = async (): Promise<IUpeProduct[]> => {
  const response = await axiosInstance.get('/product/new');
  return response.data.data;
};

const apiCaller = {
  getAllProducts,
  getHotProducts,
  getAllCategories,
  getCategoryWithProducts,
  getNewProducts,
};

export default apiCaller;
