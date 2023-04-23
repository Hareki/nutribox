import type { PoIUpeProductWithImages } from './product.pojo';

export interface PoICartItem {
  id: string;
  account_id: string;
  product_id: string;
  quantity: number;
}

export interface PoIJsonPopulatedCartItem extends Omit<PoICartItem, 'id'> {
  id?: string;
  product: string;
}
export interface PoIPopulatedCartItem extends Omit<PoICartItem, 'id'> {
  id?: string;
  product: PoIUpeProductWithImages;
}
