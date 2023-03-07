import { Schema } from 'mongoose';

import { IAccount } from '.';

import { getAddressSchema } from 'api/helpers/schema.helper';
import { IAddress } from 'api/types';

export interface IAccountAddress extends IAddress {
  _id: Schema.Types.ObjectId;
  account: IAccount;
}

export const accountAddressSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'AccountAddress/Account is required'],
  },

  ...getAddressSchema('AccountAddress'),
});
