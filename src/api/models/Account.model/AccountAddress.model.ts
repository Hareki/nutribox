import { Schema } from 'mongoose';

import { getAddressSchema } from 'api/helpers/schema.helper';
import { IAddress } from 'api/types/schema.type';

export interface IAccountAddress extends IAddress {
  _id: Schema.Types.ObjectId;
  // Note: No need, because it's already embedded in the account
  // account: IAccount;
}

export const accountAddressSchema = new Schema(
  {
    ...getAddressSchema('AccountAddress'),
  },
  { timestamps: true, collection: 'accountAddresses' },
);
