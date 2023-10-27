import { useMemo } from 'react';

import useCart from './global-states/useCart';

export function useGlobalQuantityLimitation() {
  const { cartItems } = useCart();

  const [hasOverLimitItem, hasUnavailableItem] = useMemo(() => {
    let overLimit = false;
    let unavailable = false;

    for (const item of cartItems) {
      if (item.quantity > item.product.remainingQuantity) {
        overLimit = true;
      }
      if (!item.product.available) {
        unavailable = true;
      }

      // If both conditions are met, we can break out of the loop early.
      if (overLimit && unavailable) {
        break;
      }
    }

    return [overLimit, unavailable];
  }, [cartItems]);

  return { hasOverLimitItem, hasUnavailableItem };
}
