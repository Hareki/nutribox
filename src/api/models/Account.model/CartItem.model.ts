import { Schema, Types } from 'mongoose';

export interface ICartItem {
  _id: Types.ObjectId;
  product: Types.ObjectId; // IProduct
  // Note: No need, because it's already embedded in the account
  // account: IAccount;

  quantity: number;
}

export interface ICartItemInput extends Omit<ICartItem, '_id'> {}

export const cartItemSchema = new Schema(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'CartItem/Product is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'CartItem/Quantity is required'],
      min: [1, 'CartItem/Quantity should be at least 1'],
    },
  },
  { timestamps: true, collection: 'cartItems' },
);
