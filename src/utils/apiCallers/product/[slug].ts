import type { IProduct } from 'api/models/Product.model/types';
import axiosInstance from 'utils/axiosInstance';

function extractIdFromSlug(slug: string) {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return id;
}

const getSlugs = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/product/slugs');
  const productSlugs = response.data.data;
  return productSlugs;
};

const getProduct = async (slug: string): Promise<IProduct> => {
  const id = extractIdFromSlug(slug);
  const response = await axiosInstance.get(`/product/${id}`, {
    // params: { populate: true },
  });
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
