import type { IProduct } from 'api/models/Product.model/types';
import { extractIdFromSlug } from 'helpers/product.helper';
import axiosInstance from 'constants/axiosFe.constant';

const getSlugs = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/product/slugs');
  const productSlugs = response.data.data;
  return productSlugs;
};

const getProduct = async (slug: string): Promise<IProduct> => {
  const id = extractIdFromSlug(slug);
  const response = await axiosInstance.get(`/product/${id}`);
  return response.data.data;
};

const getRelatedProducts = async (
  productId: string,
  categoryId: string,
): Promise<IProduct[]> => {
  const response = await axiosInstance.get('/product/related', {
    params: {
      productId,
      categoryId,
    },
  });

  return response.data.data;
};

const apiCaller = {
  getProduct,
  getSlugs,
  getRelatedProducts,
};

export default apiCaller;
