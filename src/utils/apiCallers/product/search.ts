import type { IUpeProduct } from 'api/models/Product.model/types';
import axiosInstance from 'constants/axiosFe.constant';

const searchProductsByName = async (
  searchQuery: string,
): Promise<IUpeProduct[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get('/product/search', {
    params: {
      name: searchQuery,
    },
  });

  const result = response.data.data;
  if (!result) return [];
  return result;
};

const apiCaller = {
  searchProductsByName,
};

export default apiCaller;
