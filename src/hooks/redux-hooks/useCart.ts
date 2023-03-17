import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

import useLoginDialog from './useLoginDialog';

import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import type { IPopulatedCartItemsAccount } from 'api/models/Account.model/types';
import type { CartItemRequestBody } from 'utils/apiCallers/global/cart';
import apiCaller from 'utils/apiCallers/global/cart';

export type CartState = { cart: IPopulatedCartItem[] };

type MutateCartItemType = {
  cart: CartItemRequestBody;
  type: CartItemActionType;
};

export type CartItemActionType = 'add' | 'remove';

const useCart = () => {
  const queryClient = useQueryClient();
  const { setLoginDialogOpen } = useLoginDialog();
  const { data: session, status } = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const accountId = session ? session.user.id : null;

  const { data: cartState, isLoading } = useQuery({
    queryKey: ['cart', accountId],
    queryFn: () => apiCaller.getCartItems(accountId),
    enabled: !!accountId,
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
