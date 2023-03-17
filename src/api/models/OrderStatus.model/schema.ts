import { Schema } from 'mongoose';

import type { IOrderStatus } from './types';

export const orderStatusSchema = new Schema<IOrderStatus>(
  {
    name: {
      type: String,
      required: [true, 'OrderStatus/Name is required'],
      maxLength: [50, 'OrderStatus/Name should be at most 50 characters'],
      unique: true,
      trim: true,
    },
  },
  {
    collection: 'orderStatuses',
  },
);
