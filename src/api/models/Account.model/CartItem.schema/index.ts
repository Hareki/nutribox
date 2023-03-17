import { Schema } from 'mongoose';

import type { ICartItem } from './types';

export const cartItemSchema = new Schema<ICartItem>(
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