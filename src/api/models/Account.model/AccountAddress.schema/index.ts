import { Schema } from 'mongoose';

import { getAddressSchema } from 'api/helpers/schema.helper';

export const accountAddressSchema = new Schema(
  {
    ...getAddressSchema('AccountAddress'),
  },
  { timestamps: true, collection: 'accountAddresses' },
);
