import { Types } from 'mongoose';

export interface ICartItem {
  _id: Types.ObjectId;
  id: string;
  product: Types.ObjectId; // IProduct
  // Note: No need, because it's already embedded in the account
  // account: IAccount;

  quantity: number;
}

export interface ICartItemInput extends Omit<ICartItem, '_id'> {}
