import { Schema } from 'mongoose';

import { IProduct } from '../Product.model';

import { IAccount } from '.';

export interface ICartItem {
  _id: Schema.Types.ObjectId;
  product: IProduct;
  account: IAccount;

  quantity: number;
}

export const cartItemSchema = new Schema(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'CartItem/Product is required'],
    },

    account: {
      ref: 'Account',
      type: Schema.Types.ObjectId,
      required: [true, 'CartItem/Account is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'CartItem/Quantity is required'],
      min: [1, 'CartItem/Quantity should be at least 1'],
    },
  },
  { timestamps: true },
);
