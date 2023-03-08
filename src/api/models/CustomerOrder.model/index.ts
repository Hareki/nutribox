import { Schema, model, models, Types } from 'mongoose';

import {
  customerOrderItemSchema,
  ICustomerOrderItem,
} from './CustomerOrderItem.model';

import { getAddressSchema, getPhoneSchema } from 'api/helpers/schema.helper';
import { IAddress } from 'api/types/schema.type';

export interface ICustomerOrder extends IAddress {
  _id: Types.ObjectId;
  items: Types.DocumentArray<ICustomerOrderItem>; // ICustomerOrderItem
  account: Types.ObjectId; // IAccount
  status: Types.ObjectId; // IOrderStatus

  createdAt: Date;
  phone: string;
  paid: boolean;
  note: string;
  profit: number;
}

const customerOrderSchema = new Schema(
  {
    items: {
      type: [customerOrderItemSchema],
      validate: {
        validator: function (items: ICustomerOrderItem[]) {
          return items.length > 0;
        },
        message: 'CustomerOrder/Items should have at least 1 item',
      },
      required: [true, 'CustomerOrder/Items should have at least 1 item'],
    },

    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'CustomerOrder/Account is required'],
    },

    status: {
      type: Schema.Types.ObjectId,
      ref: 'OrderStatus',
      required: [true, 'CustomerOrder/Status is required'],
    },

    ...getPhoneSchema('CustomerOrder'),

    paid: {
      type: Boolean,
      required: [true, 'CustomerOrder/Paid status is required'],
    },

    note: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => {
          return !value || value.length <= 500;
        },
        message: 'CustomerOrder/Note should be at most 500 characters',
      },
    },

    profit: {
      type: Number,
      required: [true, 'Profit is required'],
      min: [0, 'Customer/Profit must be greater than or equal to 0'],
    },

    ...getAddressSchema('CustomerOrder'),
  },
  { timestamps: true, collection: 'customerOrders' },
);

const CustomerOrder =
  models?.CustomerOrder || model('CustomerOrder', customerOrderSchema);
export default CustomerOrder;
