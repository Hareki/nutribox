import { z } from 'zod';

import type { CustomerModel } from './customer.model';
import { zodNumber, zodUuid } from './helper';
import type { ProductModel } from './product.model';

const CartItemSchema = z.object({
  product: zodUuid('CartItem.ProductId'),

  customer: zodUuid('CartItem.CustomerId'),

  quantity: zodNumber('CartItem.Quantity', 'int', 1, 100),
});

type CartItemModel = z.infer<typeof CartItemSchema>;

type CartItemReferenceKeys = keyof Pick<CartItemModel, 'product' | 'customer'>;

type PopulateField<K extends keyof CartItemModel> = K extends 'product'
  ? ProductModel
  : K extends 'customer'
  ? CustomerModel
  : never;

type PopulateCartItemFields<K extends CartItemReferenceKeys> = Omit<
  CartItemModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedCartItemModel =
  PopulateCartItemFields<CartItemReferenceKeys>;

export { CartItemSchema };
export type {
  CartItemModel,
  FullyPopulatedCartItemModel,
  PopulateCartItemFields,
};
