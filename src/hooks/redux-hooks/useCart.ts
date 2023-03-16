import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

import useLoginDialog from './useLoginDialog';

import { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import apiCaller, { CartItemRequestBody } from 'utils/apiCallers/global/cart';

export type CartState = { cart: IPopulatedCartItem[] };

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

  const updateCartAmount = (
    item: IPopulatedCartItem,
    type: CartItemActionType,
  ) => {
    if (status === 'authenticated') {
      mutateCartItem({
        cart: {
          productId: item.product.id,
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
