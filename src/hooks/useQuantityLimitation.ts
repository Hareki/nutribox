import type { CommonProductModel } from 'backend/services/product/helper';

export function useQuantityLimitation(
  product: CommonProductModel,
  cartItem: { quantity: number } | undefined,
) {
  const maxQuantity = product.remainingQuantity;
  const inStock = maxQuantity > 0;
  const disableAddToCart = (cartItem?.quantity || 0) >= maxQuantity;
  const overLimit = (cartItem?.quantity || 0) > maxQuantity;

  return { maxQuantity, inStock, disableAddToCart, overLimit };
}
