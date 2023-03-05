import { Schema, model, models } from 'mongoose';

import { IAddress } from 'api/types';

export interface IAccountAddress extends IAddress {
  _id: Schema.Types.ObjectId;
}

const accountAddressSchema = new Schema({
  province: {
    type: String,
    required: [true, 'Account province is required'],
    trim: true,
  },

  district: {
    type: String,
    required: [true, 'Account district is required'],
    trim: true,
  },

  ward: {
    type: String,
    required: [true, 'Account ward is required'],
    trim: true,
  },

  streetAddress: {
    type: String,
    required: [true, 'Account street address is required'],
    trim: true,
  },
});

const AccountAddress =
  models?.AccountAddress || model('AccountAddress', accountAddressSchema);
export default AccountAddress;
