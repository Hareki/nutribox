import { Schema } from 'mongoose';

import { consumptionHistorySchema } from './ConsumptionHistory.schema';
import type { IConsumptionHistory } from './ConsumptionHistory.schema/types';
import type { ICustomerOrderItem } from './types';

export const customerOrderItemSchema = new Schema<ICustomerOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'CustomerOrderItem/Product is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'CustomerOrderItem/Quantity is required'],
      min: [1, 'CustomerOrderItem/Quantity should be greater than 0'],
    },

    // Price is in VND
    unitWholesalePrice: {
      type: Number,
      required: [true, 'CustomerOrderItem/unitWholesalePrice is required'],
      min: [1, 'CustomerOrderItem/unitWholesalePrice should be greater than 0'],
    },

    // Price is in VND
    unitRetailPrice: {
      type: Number,
      required: [true, 'CustomerOrderItem/UnitRetailPrice is required'],
      min: [1, 'CustomerOrderItem/UnitRetailPrice should be greater than 0'],
    },

    consumptionHistory: {
      type: [consumptionHistorySchema],
      validate: {
        validator: function (items: IConsumptionHistory[]) {
          return items.length > 0;
        },
        message:
          'CustomerOrderItem/ConsumptionHistory should have at least 1 item',
      },
      required: [
        true,
        'CustomerOrderItem/ConsumptionHistory should have at least 1 item',
      ],
    },
  },
  { collection: 'customerOrderItems' },
);
