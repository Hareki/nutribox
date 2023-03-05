import { Schema, model, models } from 'mongoose';

import { IOrderStatus } from './OrderStatus.model';

import { IAddress } from 'api/types';
import { phoneRegex } from 'helpers/regex';

export interface ICustomerOrderItem {
  dish: Schema.Types.ObjectId;
  // No need, because it's already embedded in the customerOrder
  // customerOrder: Schema.Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

const customerOrderItemSchema = new Schema({
  dish: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: [true, 'Dish is required'],
  },

  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be greater than 0'],
  },

  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price must be greater than or equal to 0'],
  },
});

export interface ICustomerOrder extends IAddress {
  _id: Schema.Types.ObjectId;
  items: ICustomerOrderItem[];
  orderStatus: IOrderStatus;

  paid: boolean;
  phone: string;
  note: string;
  profit: number;
}

const customerOrderSchema = new Schema(
  {
    items: {
      type: [customerOrderItemSchema],
      validate: {
        validator: function (items: ICustomerOrderItem[]) {
          return items && items.length > 0;
        },
        message: 'Customer order must have at least one item',
      },
      required: [true, 'Customer order must have at least one item'],
    },

    orderStatus: {
      type: Schema.Types.ObjectId,
      ref: 'OrderStatus',
      required: [true, 'Order status is required'],
    },

    paid: {
      type: Boolean,
      required: [true, 'Paid status is required'],
    },

    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: (value: string) => value && phoneRegex.test(value),
        message: 'Invalid customer order phone number format',
      },
      unique: true,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          return !value || value.length <= 500;
        },
        message: 'Note must be at most 500 characters',
      },
    },

    profit: {
      type: Number,
      required: [true, 'Profit is required'],
      min: [0, 'Profit must be greater than or equal to 0'],
    },

    province: {
      type: String,
      required: [true, 'Order province is required'],
      trim: true,
    },

    district: {
      type: String,
      required: [true, 'Order district is required'],
      trim: true,
    },

    ward: {
      type: String,
      required: [true, 'Order ward is required'],
      trim: true,
    },

    streetAddress: {
      type: String,
      required: [true, 'Order street address is required'],
      trim: true,
    },
  },
  { timestamps: true },
);

const CustomerOrder =
  models?.CustomerOrder || model('CustomerOrder', customerOrderSchema);
export default CustomerOrder;
