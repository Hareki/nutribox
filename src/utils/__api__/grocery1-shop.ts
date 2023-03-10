import axios from 'axios';

import { CategoryNavList } from 'components/page-sidenav/types';
import Product from 'models/BazaarProduct.model';
import Service from 'models/Service.model';
import axiosInstance from 'utils/axiosInstance';

const getNavList = async (): Promise<CategoryNavList> => {
  // const response = await axios.get('/api/grocery-1/navigation');
  const response = await axiosInstance.get('/category/all', {
    params: { populate: true },
  });

  // console.log(response.data.data);
  return { listItems: response.data.data };
};

const getPopularProducts = async (): Promise<Product[]> => {
  const response = await axios.get('/api/grocery-1/products?tag=popular');
  return response.data;
};

const getTrendingProducts = async (): Promise<Product[]> => {
  const response = await axios.get('/api/grocery-1/products?tag=trending');
  return response.data;
};

const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get('/api/grocery-1/products');
  return response.data;
};

const getServices = async (): Promise<Service[]> => {
  const response = await axios.get('/api/grocery-1/services');
  return response.data;
};

const getTestimonials = async () => {
  const response = await axios.get('/api/grocery-1/testimonial-list');
  return response.data;
};

export default {
  getServices,
  getProducts,
  getPopularProducts,
  getTrendingProducts,
  getNavList,
  getTestimonials,
};
