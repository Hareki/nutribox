import { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import { CartState } from 'hooks/redux-hooks/useCart';
import axiosInstance from 'utils/axiosInstance';

export interface CartItemRequestBody {
  productId: string;
  quantity: number;
}

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
