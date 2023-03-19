import { Schema } from 'mongoose';

import type { IAccountAddress } from './types';

import { getAddressSchema } from 'api/helpers/schema.helper';

export const accountAddressSchema = new Schema<IAccountAddress>(
  {
    title: {
      type: String,
      required: [true, 'AccountAddress/Title is required'],
      maxLength: [50, 'AccountAddress/Title should be at most 50 characters'],
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
    ...getAddressSchema('AccountAddress'),
  },
  { timestamps: true, collection: 'accountAddresses' },
);
