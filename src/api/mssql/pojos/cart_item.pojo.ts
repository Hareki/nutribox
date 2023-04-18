import type { IUpeProduct } from './product.pojo';

export interface ICartItem {
  id: string;
  account_id: string;
  product_id: string;
  quantity: number;
}

export interface IPopulatedCartItem
  extends Omit<ICartItem, 'id' | 'product_id' | 'account_id'> {
  id?: string;
  product_id: IUpeProduct;
  quantity: number;
}

export interface ICartItemInput extends Omit<ICartItem, 'id'> {}
