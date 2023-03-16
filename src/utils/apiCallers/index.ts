import { paginationConstant } from './../constants';

import { IProduct } from 'api/models/Product.model/types';
import {
  IProductCategory,
  IPopulatedProductCategory,
} from 'api/models/ProductCategory.model/types';
import {
  GetPaginationPrerenderResult,
  GetPaginationResult,
} from 'api/types/pagination.type';
import axiosInstance from 'utils/axiosInstance';

const getAllCategories = async (): Promise<IProductCategory[]> => {
  const response = await axiosInstance.get('/category/all', {
    // params: { populate: true },
  });
  const allCategory: IProductCategory = {
    _id: '' as any, // Bypass type checking, because we don't have and don't need it anyway
    id: '',
    name: 'Tất cả',
    slug: '',
    products: [],
  };

  response.data.data.unshift(allCategory);
  // console.log('file: index.ts:21 - getAllCategories - categories:', categories);
  return response.data.data;
};

const getAllProducts = async (
  pageNumInput: number,
): Promise<GetPaginationResult<IProduct>> => {
  let pageNum: number, docsPerPage: number;
  if (!pageNumInput) {
    pageNum = 1;
    docsPerPage = paginationConstant.infiniteDocsPerPage;
  } else {
    pageNum = pageNumInput;
    docsPerPage = paginationConstant.docsPerPage;
  }

  if (docsPerPage === paginationConstant.infiniteDocsPerPage)
    console.log('WARNING: docsPerPage is infiniteDocsPerPage');

  const response = await axiosInstance.get('/product/all', {
    params: {
      page: pageNum,
      docsPerPage: docsPerPage,
    },
  });
  return response.data.data;
};

const getHotProducts = async (): Promise<IProduct[]> => {
  const response = await axiosInstance.get('/product/hot', {
    // params: { populate: true },
  });
  return response.data.data;
};

const getCategoryWithProducts = async (
  categoryId: string,
): Promise<IPopulatedProductCategory> => {
  const response = await axiosInstance.get(`/category/${categoryId}`, {
    params: { populate: true },
  });
  return response.data.data;
};

const getNewProducts = async (): Promise<IProduct[]> => {
  const response = await axiosInstance.get('/product/new', {
    // params: { populate: true },
  });
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
