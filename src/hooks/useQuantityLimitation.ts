import { useMemo } from 'react';

import { getMaxProductQuantity } from 'helpers/product.helper';
import type { ImportOrderModel } from 'models/importOder.model';

export function useQuantityLimitation(
  importOrders: ImportOrderModel[],
  cartItem: { quantity: number } | undefined,
) {
  const maxQuantity = useMemo(
    () => getMaxProductQuantity(importOrders),
    [importOrders],
  );
  const inStock = maxQuantity > 0;
  const disableAddToCart = (cartItem?.quantity || 0) >= maxQuantity;
  const overLimit = (cartItem?.quantity || 0) > maxQuantity;

  return { maxQuantity, inStock, disableAddToCart, overLimit };
}
