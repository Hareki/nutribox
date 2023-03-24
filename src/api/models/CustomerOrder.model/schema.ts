import { Schema } from 'mongoose';

import { customerOrderItemSchema } from './CustomerOrderItem.schema';
import type { ICustomerOrderItem } from './CustomerOrderItem.schema/types';
import type { ICustomerOrder } from './types';

import { getAddressSchema, getPhoneSchema } from 'api/helpers/schema.helper';

export const customerOrderSchema = new Schema<ICustomerOrder>(
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

    ...getPhoneSchema('CustomerOrder', false),

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
      required: [true, 'CustomerOrder/Profit is required'],
      min: [0, 'Customer/Profit must be greater than or equal to 0'],
    },

    total: {
      type: Number,
      required: [true, 'Customer/Total is required'],
      min: [0, 'CustomerOrder/Total must be greater than or equal to 0'],
    },

    estimatedDeliveryTime: {
      type: Date,
      required: [true, 'CustomerOrder/EstimatedDeliveryTime is required'],
    },

    estimatedDistance: {
      type: Number,
      required: [true, 'CustomerOrder/EstimatedDistance is required'],
    },

    deliveredOn: {
      type: Date,
    },

    ...getAddressSchema('CustomerOrder'),
  },
  { timestamps: true, collection: 'customerOrders' },
);

// customerOrderSchema.pre('save', preSaveWasNew);

// customerOrderSchema.post(
//   'save',
//   function (doc: Document<ICustomerOrder>, next) {
//     if (!doc.wasNew) next();

//     handleReferenceChange({
//       action: 'save',
//       doc,
//       fieldName: 'account',
//       referencedFieldName: 'customerOrders',
//       referencedModelName: 'Account',
//       next,
//     });
//   },
// );

// customerOrderSchema.post(
//   'findOneAndDelete',
//   function (doc: Document<ICustomerOrder>, next) {
//     handleReferenceChange({
//       action: 'findOneAndDelete',
//       doc,
//       fieldName: 'account',
//       referencedFieldName: 'customerOrders',
//       referencedModelName: 'Account',
//       next,
//     });
//   },
// );
