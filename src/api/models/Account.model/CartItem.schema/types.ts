import type { Types } from 'mongoose';

import type { IProduct } from 'api/models/Product.model/types';

export interface ICartItem {
  _id: Types.ObjectId;
  id: string;
  product: Types.ObjectId; // IProduct
  // Note: No need, because it's already embedded in the account
  // account: IAccount;

  quantity: number;
}

export interface IPopulatedCartItem
  extends Omit<ICartItem, '_id' | 'id' | 'product'> {
  id?: string;
  product: IProduct;
  quantity: number;
}

export interface ICartItemInput extends Omit<ICartItem, '_id'> {}
