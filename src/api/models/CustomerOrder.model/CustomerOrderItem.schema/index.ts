import { Schema } from 'mongoose';

export const customerOrderItemSchema = new Schema(
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
    unitRetailPrice: {
      type: Number,
      required: [true, 'CustomerOrderItem/UnitRetailPrice is required'],
      min: [1, 'CustomerOrderItem/UnitRetailPrice should be greater than 0'],
    },
  },
  { collection: 'customerOrderItems' },
);
