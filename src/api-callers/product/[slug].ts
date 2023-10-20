import type {
  CommonProductModel,
  ProductDetailWithRelated,
} from 'backend/services/product/helper';
import type { JSSuccess } from 'backend/types/jsend';
import axiosInstance from 'constants/axiosFe.constant';
import {
  PRODUCT_DETAIL_API_ROUTE,
  SLUGS_API_ROUTE,
} from 'constants/routes.api.constant';
import { extractIdFromSlug } from 'helpers/product.helper';
import { insertId } from 'utils/middleware.helper';

// For SSR
const getSlugs = async (): Promise<string[]> => {
  const response =
    await axiosInstance.get<JSSuccess<string[]>>(SLUGS_API_ROUTE);
  const productSlugs = response.data.data;
  return productSlugs;
};

const getProduct = async (
  slug: string,
  related = true,
): Promise<ProductDetailWithRelated | CommonProductModel> => {
  console.log('file: [slug].ts:26 - slug:', slug);
  const id = extractIdFromSlug(slug);
  const response = await axiosInstance.get<
    JSSuccess<ProductDetailWithRelated | CommonProductModel>
  >(insertId(PRODUCT_DETAIL_API_ROUTE, id), {
    params: {
      related,
    },
  });
  return response.data.data;
};

const apiCaller = {
  getProduct,
  getSlugs,
};

export default apiCaller;
