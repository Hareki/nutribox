import { Schema, model, models } from 'mongoose';

import { IAddress } from 'api/types';
import { phoneRegex } from 'helpers/regex';

export interface IStore extends IAddress {
  _id: Schema.Types.ObjectId;
  phone: string;
}

const storeSchema = new Schema({
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    validate: {
      validator: (value: string) => value && phoneRegex.test(value),
      message: 'Invalid phone number format',
    },
    unique: true,
    trim: true,
  },

  province: {
    type: String,
    required: [true, 'Supplier province is required'],
    trim: true,
  },

  district: {
    type: String,
    required: [true, 'Supplier district is required'],
    trim: true,
  },

  ward: {
    type: String,
    required: [true, 'Supplier ward is required'],
    trim: true,
  },

  streetAddress: {
    type: String,
    required: [true, 'Supplier street address is required'],
    trim: true,
  },
});

const Store = models?.Store || model('Store', storeSchema);
export default Store;
