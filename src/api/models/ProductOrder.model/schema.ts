import { Schema } from 'mongoose';

import { IProductOrder } from './types';

export const productOrderSchema = new Schema<IProductOrder>(
  {
    product: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Product is required'],
    },

    supplier: {
      ref: 'Supplier',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Supplier is required'],
    },

    status: {
      ref: 'OrderStatus',
      type: Schema.Types.ObjectId,
      required: [true, 'ProductOrder/Status is required'],
    },

    quantity: {
      type: Number,
      required: [true, 'ProductOrder/Quantity is required'],
      min: [1, 'ProductOrder/Quantity should be at least 1'],
    },

    unitWholesalePrice: {
      type: Number,
      required: [true, 'ProductOrder/UnitWholesalePrice is required'],
      min: [1, 'ProductOrder/UnitWholesalePrice should be at least 1'],
    },
  },
  {
    timestamps: true,
    collection: 'productOrders',
  },
);
