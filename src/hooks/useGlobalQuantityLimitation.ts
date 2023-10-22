import { useMemo } from 'react';

import useCart from './global-states/useCart';

export function useGlobalQuantityLimitation() {
  const { cartItems } = useCart();

  const hasOverLimitItem = useMemo(() => {
    return cartItems.some(
      (item) => item.quantity > item.product.remainingQuantity,
    );
  }, [cartItems]);

  return { hasOverLimitItem };
}
