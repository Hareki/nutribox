import type { ProductEntity } from 'backend/entities/product.entity';
import type { CartItemModel } from 'models/cartItem.model';
import type { PopulateProductFields } from 'models/product.model';

export type CommonProductModel = PopulateProductFields<
  'importOrders' | 'productImages' | 'productCategory'
>;

export const CommonProductRelations: (keyof ProductEntity)[] = [
  'productImages',
  'productCategory',
  'importOrders',
];

export type CommonCartItem = Omit<CartItemModel, 'product'> & {
  product: CommonProductModel;
};

export type ProductDetailWithRelated = CommonProductModel & {
  relatedProducts: CommonProductModel[];
};
