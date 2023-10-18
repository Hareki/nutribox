import type { CartItemDto } from 'backend/dtos/cartItem.dto';
import type { CommonCartItem } from 'backend/services/product/helper';
import axiosInstance from 'constants/axiosFe.constant';
import { CART_ITEMS_API_ROUTE } from 'constants/routes.api.constant';
import type { Id } from 'types/common';

export const updateCartItem = async ({
  product,
  quantity,
}: CartItemDto): Promise<CommonCartItem[]> => {
  const response = await axiosInstance.post(CART_ITEMS_API_ROUTE, {
    product,
    quantity,
  });
  return response.data.data;
};

export const getCartItems = async (): Promise<(CommonCartItem & Id)[]> => {
  const response = await axiosInstance.get(CART_ITEMS_API_ROUTE);
  return response.data.data;
};

const apiCaller = {
  getCartItems,
  updateCartItem,
};

export default apiCaller;
