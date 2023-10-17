import { useMemo } from 'react';

import useCart from './global-states/useCart';

import { getMaxProductQuantity } from 'helpers/product.helper';

export function useGlobalQuantityLimitation() {
  const { cartState } = useCart();

  const hasOverLimitItem = useMemo(() => {
    return cartState.cart.some(
      (item) => item.quantity > getMaxProductQuantity(item.product.expirations),
    );
  }, [cartState.cart]);

  return { hasOverLimitItem };
}
