import { Schema } from 'mongoose';

import type { ISupplier } from './types';

import {
  getAddressSchema,
  getEmailSchema,
  getPhoneSchema,
} from 'api/helpers/schema.helper';

export const supplierSchema = new Schema<ISupplier>(
  {
    productOrders: [
      {
        ref: 'ProductOrder',
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],

    name: {
      type: String,
      required: [true, 'Supplier/Name is required'],
      maxLength: [100, 'Supplier/Name should be at most 100 characters'],
      unique: true,
      trim: true,
    },

    ...getPhoneSchema('Supplier'),

    ...getEmailSchema('Supplier'),

    ...getAddressSchema('Supplier'),
  },
  {
    timestamps: true,
  },
);
