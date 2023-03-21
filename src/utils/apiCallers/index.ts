import { paginationConstant } from './../constants';

import type { IUpeProduct } from 'api/models/Product.model/types';
import type {
  IProductCategory,
  IPopulatedUpeProductCategory,
} from 'api/models/ProductCategory.model/types';
import type { GetPaginationResult } from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';

const getAllCategories = async (): Promise<IProductCategory[]> => {
  const response = await axiosInstance.get('/category/all');
  const allCategory: IProductCategory = {
    id: '',
    name: 'Tất cả',
    slug: '',
    products: [],
  };

  response.data.data.unshift(allCategory);
  return response.data.data;
};

const getAllProducts = async (
  pageNumInput: number,
): Promise<GetPaginationResult<IUpeProduct>> => {
  let pageNum: number, docsPerPage: number;
  if (!pageNumInput) {
    pageNum = 1;
    docsPerPage = paginationConstant.infiniteDocsPerPage;
  } else {
    pageNum = pageNumInput;
    docsPerPage = paginationConstant.docsPerPage;
  }

  if (docsPerPage === paginationConstant.infiniteDocsPerPage)
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
