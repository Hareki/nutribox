import { ICartItem } from 'api/models/Account.model/CartItem.schema/types';
import axiosInstance from 'utils/axiosInstance';

export interface CartItemRequestBody {
  accountId: string;
  productId: string;
  quantity: number;
}

export interface CartItemResponseBody {
  cart: ICartItem;
}

export const updateCartItem = async ({
  accountId,
  productId,
  quantity,
}: CartItemRequestBody): Promise<CartItemResponseBody> => {
  const response = await axiosInstance.put(`/cart/${accountId}`, {
    productId,
    quantity,
  });
  return response.data.data;
};
