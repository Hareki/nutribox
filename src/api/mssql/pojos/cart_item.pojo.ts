import type { IUpeProductWithImages } from './product.pojo';

export interface ICartItem {
  id: string;
  account_id: string;
  product_id: string;
  quantity: number;
}

export interface IJsonPopulatedCartItem
  extends Omit<ICartItem, 'id' | 'product_id' | 'account_id'> {
  id?: string;
  product_id: string;
  quantity: number;
}
export interface IPopulatedCartItem
  extends Omit<ICartItem, 'id' | 'product_id' | 'account_id'> {
  id?: string;
  product_id: IUpeProductWithImages;
  quantity: number;
}

export interface ICartItemInput extends Omit<ICartItem, 'id'> {}
