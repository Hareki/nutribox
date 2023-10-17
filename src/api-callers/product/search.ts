import type { CommonProductModel } from 'backend/services/product/helper';
import axiosInstance from 'constants/axiosFe.constant';
import { PRODUCTS_API_ROUTE } from 'constants/routes.api.constant';

const searchProductsByName = async (
  searchQuery: string | undefined,
): Promise<CommonProductModel[]> => {
  if (!searchQuery) return [];
  const response = await axiosInstance.get(PRODUCTS_API_ROUTE, {
    params: {
      keyword: searchQuery,
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
