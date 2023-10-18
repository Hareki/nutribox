import { useMemo } from 'react';

import useCart from './global-states/useCart';

import { getMaxProductQuantity } from 'helpers/product.helper';

export function useGlobalQuantityLimitation() {
  const { cartItems } = useCart();

  const hasOverLimitItem = useMemo(() => {
    return cartItems.some(
      (item) =>
        item.quantity > getMaxProductQuantity(item.product.importOrders),
    );
  }, [cartItems]);

  return { hasOverLimitItem };
}
