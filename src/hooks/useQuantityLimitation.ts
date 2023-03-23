import { useMemo } from 'react';

import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import type { IExpiration } from 'api/models/Expiration.model/types';
import { getMaxUpeQuantity } from 'helpers/product.helper';

export function useQuantityLimitation(
  expirations: IExpiration[],
  cartItem: IPopulatedCartItem,
) {
  const maxQuantity = useMemo(
    () => getMaxUpeQuantity(expirations),
    [expirations],
  );
  const inStock = maxQuantity > 0;
  const disableAddToCart = (cartItem?.quantity || 0) >= maxQuantity;
  const overLimit = (cartItem?.quantity || 0) > maxQuantity;

  return { maxQuantity, inStock, disableAddToCart, overLimit };
}
