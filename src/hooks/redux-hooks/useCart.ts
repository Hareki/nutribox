import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

import useLoginDialog from './useLoginDialog';

import { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import { IProduct } from 'api/models/Product.model/types';
import apiCaller, { CartItemRequestBody } from 'utils/apiCallers/global/cart';

export interface CartItem extends IProduct {
  quantity: number;
}
export type CartState = { cart: CartItem[] };

type MutateCartItemType = {
  cart: CartItemRequestBody;
  type: CartItemActionType;
};

export type CartItemActionType = 'add' | 'remove';

const useCart = (accountId = '640eda951bfd6bd755f28211') => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: cartState, isLoading } = useQuery({
    queryKey: ['cart', accountId],
    queryFn: () => apiCaller.getCartItems(accountId),
    initialData: { cart: [] },
  });

  const { mutate: mutateCartItem } = useMutation<
    IPopulatedCartItemsAccount,
    unknown,
    MutateCartItemType
  >({
    mutationFn: ({ cart }) =>
      apiCaller.updateCartItem(accountId, {
        productId: cart.productId,
        quantity: cart.quantity,
      }),
    onSuccess: (account, { type }) => {
      queryClient.setQueriesData(['cart', accountId], {
        cart: account.cartItems,
      });
      queryClient.invalidateQueries(['cart', accountId]);

      if (type === 'remove') {
        enqueueSnackbar('Removed from Cart', { variant: 'error' });
      } else {
        enqueueSnackbar('Added to Cart', { variant: 'success' });
      }
    },
  });

  const { setLoginDialogOpen } = useLoginDialog();
  const { status } = useSession();

  const updateCartAmount = (item: CartItem, type: CartItemActionType) => {
    if (status === 'authenticated') {
      mutateCartItem({
        cart: {
          productId: item.id,
          quantity: item.quantity,
        },
        type,
      });
    } else {
      setLoginDialogOpen(true);
    }
  };

  return {
    cartState,
    isLoading,
    updateCartAmount,
  };
};

export default useCart;
