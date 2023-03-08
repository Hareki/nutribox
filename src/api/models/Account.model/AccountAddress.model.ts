import { Schema, Types } from 'mongoose';

import { getAddressSchema } from 'api/helpers/schema.helper';
import { IAddress } from 'api/types/schema.type';

export interface IAccountAddress extends IAddress {
  _id: Types.ObjectId;
  // Note: No need, because it's already embedded in the account
  // account: IAccount;
}

export interface IAccountAddressInput extends Omit<IAccountAddress, '_id'> {}

export const accountAddressSchema = new Schema(
  {
    ...getAddressSchema('AccountAddress'),
  },
  { timestamps: true, collection: 'accountAddresses' },
);
