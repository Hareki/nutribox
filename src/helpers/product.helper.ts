import type { ImportOrderModel } from 'models/importOder.model';

export function extractIdFromSlug(slug: string | undefined) {
  if (!slug) return '';
  console.log('file: product.helper.ts:4 - extractIdFromSlug - slug:', slug);
  const parts = slug.split('_');
  const id = parts[parts.length - 1];
  return id || '';
}

export function getMaxProductQuantity(importOrders: ImportOrderModel[]) {
  const result = importOrders.reduce((max, importOrder) => {
    max += importOrder.remainingQuantity;
    return max;
  }, 0);

  return result;
}

// // RB = request body
// export function convertCartToOrderRb(
//   cartItem: FullyPopulatedCartItemModel,
// ): CheckoutItemsRequestBody {
//   const { product, quantity } = cartItem;
//   const { wholesalePrice, retailPrice } = product;

//   return {
//     productId: product.id,
//     quantity,
//     unitWholesalePrice: wholesalePrice,
//     unitRetailPrice: retailPrice,
//   };
// }
