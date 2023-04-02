import { Schema } from 'mongoose';

import type { IConsumptionHistory } from './types';

export const consumptionHistorySchema = new Schema<IConsumptionHistory>(
  {
    expiration: {
      type: Schema.Types.ObjectId,
      ref: 'Expiration',
      required: [true, 'ConsumptionHistory/Expiration is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'ConsumptionHistory/Quantity is required'],
      min: [1, 'ConsumptionHistory/Quantity should be greater than 0'],
    },
  },
  { collection: 'consumptionHistory' },
);
