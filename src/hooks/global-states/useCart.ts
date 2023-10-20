import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';

import useLoginDialog from './useLoginDialog';

import apiCaller from 'api-callers/global/cart';
import type { CartItemDto } from 'backend/dtos/cartItem.dto';
import type { CommonCartItem } from 'backend/services/product/helper';

type MutateCartItemType = {
  cart: CartItemDto;
  type: CartItemActionType;
};

const DEBOUNCE_DELAY = 300;
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

  const [tempQuantity, setTempQuantity] = useState<number | null>(null);
  const [lastActionType, setLastActionType] = useState<
    CartItemActionType | undefined
  >(undefined);
  const debouncedQuantity = useDebounce(tempQuantity, DEBOUNCE_DELAY);
  const [debouncedItem, setDebouncedItem] = useState<
    CommonCartItem | undefined
  >();

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

      setTempQuantity(null);

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

  const updateCartAmount = useCallback(
    (item: CommonCartItem, type?: CartItemActionType) => {
      if (!type) return;
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
    },
    [mutateCartItem, setLoginDialogOpen, status],
  );

  const handleUpdateCartAmount = (
    item: CommonCartItem,
    type: CartItemActionType,
  ) => {
    if (status === 'authenticated') {
      setTempQuantity(item.quantity); // Reflect the change instantly to tempQuantity
      setLastActionType(type);
      setDebouncedItem(item);
    } else {
      setLoginDialogOpen(true);
    }
  };

  const existingCartItem: CommonCartItem | undefined = useMemo(() => {
    if (productId) {
      return cartItems?.find((item) => {
        return item.product.id === productId;
      });
    }
    return undefined;
  }, [cartItems, productId]);

  useEffect(() => {
    if (debouncedQuantity !== null && debouncedItem) {
      updateCartAmount(
        { ...debouncedItem, quantity: debouncedQuantity },
        lastActionType,
      );
      setLastActionType(undefined);
      setDebouncedItem(undefined);
    }
  }, [
    debouncedQuantity,
    existingCartItem,
    updateCartAmount,
    lastActionType,
    debouncedItem,
  ]);

  return {
    existingCartItem: {
      ...existingCartItem,
      quantity: tempQuantity || existingCartItem?.quantity || 0, // Override quantity with tempQuantity if available
    },
    cartItems,
    isLoading,
    updateCartAmount: handleUpdateCartAmount,
  };
};

export default useCart;
