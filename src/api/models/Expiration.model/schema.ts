import { Schema } from 'mongoose';

import type { IExpiration } from './types';

export const expirationSchema = new Schema<IExpiration>(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'Expiration/Product is required'],
    },

    expirationDate: {
      type: Date,
      required: [true, 'Expiration/ExpirationDate is required'],
      min: [
        new Date(new Date().getTime() + 86400000),
        'Expiration/ExpirationDate should be at least 1 day from now',
      ],
    },

    quantity: {
      type: Number,
      required: [true, 'Expiration/Quantity is required'],
      min: [1, 'Expiration/Quantity should be at least 1'],
    },
  },
  {
    timestamps: true,
  },
);
