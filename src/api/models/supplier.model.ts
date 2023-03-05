import { Schema, model, models } from 'mongoose';
import validator from 'validator';

import { IAddress } from 'api/types';
import { phoneRegex } from 'helpers/regex';

export interface ISupplier extends IAddress {
  _id: Schema.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
}

const supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
      unique: true,
    },

    phone: {
      type: String,
      required: [true, 'Supplier Phone is required'],
      validate: {
        validator: (value: string) => value && phoneRegex.test(value),
        message: 'Invalid supplier phone number format',
      },
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Supplier email is required'],
      validate: {
        validator: validator.isEmail,
        message: 'Invalid supplier email format',
      },
      unique: true,
      lowercase: true,
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
  },
  { timestamps: true },
);

const Supplier = models?.Supplier || model('Supplier', supplierSchema);
export default Supplier;
