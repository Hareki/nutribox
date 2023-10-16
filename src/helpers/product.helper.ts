export function extractIdFromSlug(slug: string) {
  const parts = slug.split('-');
  const id = parts[parts.length - 1];
  return id;
}

// export function getMaxUpeQuantity(expirations: IExpiration[]) {
//   const result = expirations.reduce((max, expiration) => {
//     max += expiration.quantity;
//     return max;
//   }, 0);

//   return result;
// }

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
