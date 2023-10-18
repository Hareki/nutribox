import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

import useLoginDialog from './useLoginDialog';

import apiCaller from 'api-callers/global/cart';
import type { CartItemDto } from 'backend/dtos/cartItem.dto';
import type { CommonCartItem } from 'backend/services/product/helper';

type MutateCartItemType = {
  cart: CartItemDto;
  type: CartItemActionType;
};

export type CartItemActionType = 'add' | 'remove' | 'update';

const useCart = (productId?: string) => {
  const queryClient = useQueryClient();
  const { setLoginDialogOpen } = useLoginDialog();
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const customerId = session?.account.customer.id;

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', customerId],
    queryFn: () => apiCaller.getCartItems(),
    enabled: !!customerId,
    initialData: [],
  });

  const { mutate: mutateCartItem } = useMutation<
    CommonCartItem[],
    unknown,
    MutateCartItemType
  >({
    mutationFn: ({ cart }) =>
      apiCaller.updateCartItem({
        product: cart.product,
        quantity: cart.quantity,
      }),
    onSuccess: (cartItems, { type }) => {
      queryClient.setQueryData(['cart', customerId], cartItems);
      queryClient.invalidateQueries(['cart', customerId]);

      switch (type) {
        case 'add':
          enqueueSnackbar('Đã thêm vào giỏ hàng', { variant: 'success' });
          break;
        case 'remove':
          enqueueSnackbar('Đã xoá khỏi giỏ hàng', { variant: 'error' });
          break;
        case 'update':
          enqueueSnackbar('Đã cập nhật giỏ hàng', { variant: 'success' });
      }
    },
  });

  const updateCartAmount = (item: CommonCartItem, type: CartItemActionType) => {
    if (status === 'authenticated') {
      // const inStock = item.product.expirations.length > 0;
      // if (!inStock && type === 'add') return;

      mutateCartItem({
        cart: {
          product: item.product.id,
          quantity: item.quantity,
        },
        type,
      });
    } else {
      setLoginDialogOpen(true);
    }
  };

  let cartItem: CommonCartItem | undefined;
  if (productId) {
    cartItem = cartItems?.find((item) => {
      return item.product.id === productId;
    });
  }

  return {
    cartItem,
    cartItems,
    isLoading,
    updateCartAmount,
  };
};

export default useCart;
