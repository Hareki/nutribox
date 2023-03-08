import { Schema } from 'mongoose';

import { IProduct } from '../Product.model';

export interface ICartItem {
  _id: Schema.Types.ObjectId;
  product: IProduct;
  // Note: No need, because it's already embedded in the account
  // account: IAccount;

  quantity: number;
}

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
