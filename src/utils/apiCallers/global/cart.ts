import type { CartItemRequestBody } from '../../../../pages/api/cart/[accountId]';

import type { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import type { CartState } from 'hooks/global-states/useCart';
import axiosInstance from 'constants/axiosFe.constant';

export const updateCartItem = async (
  accountId: string,
  { productId, quantity }: CartItemRequestBody,
): Promise<IPopulatedCartItemsAccount> => {
  const response = await axiosInstance.put(`/cart/${accountId}`, {
    productId,
    quantity,
  });
  return response.data.data;
};

export const getCartItems = async (accountId: string): Promise<CartState> => {
  const response = await axiosInstance.get(`/cart/${accountId}`);
  return response.data.data;
};

const apiCaller = {
  getCartItems,
  updateCartItem,
};

export default apiCaller;
