import { Schema } from 'mongoose';

import type { IAccountAddress } from './types';

import { getAddressSchema } from 'api/helpers/schema.helper';

export const accountAddressSchema = new Schema<IAccountAddress>(
  {
    ...getAddressSchema('AccountAddress'),
  },
  { timestamps: true, collection: 'accountAddresses' },
);
