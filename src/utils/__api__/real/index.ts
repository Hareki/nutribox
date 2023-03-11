import { IProduct } from 'api/models/Product.model/types';
import axiosInstance from 'utils/axiosInstance';

const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await axiosInstance.get('/product/all', {
    // params: { populate: true },
  });
  return response.data.data;
};

const getHotProducts = async (): Promise<IProduct[]> => {
  const response = await axiosInstance.get('/product/hot', {
    // params: { populate: true },
  });
  return response.data.data;
};

const realApi = {
  getAllProducts,
  getHotProducts,
};

export default realApi;
