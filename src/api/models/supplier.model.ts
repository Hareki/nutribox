import { Schema, model, models, Types, Model } from 'mongoose';

import {
  getAddressSchema,
  getEmailSchema,
  getPhoneSchema,
} from 'api/helpers/schema.helper';
import { IAddress } from 'api/types/schema.type';

export interface ISupplier extends IAddress {
  _id: Types.ObjectId;
  // NOTE: We might want to see all the orders of a supplier in the future
  productOrders: Types.ObjectId[]; // IProductOrder

  name: string;
  phone: string;
  email: string;
}

export interface ISupplierInput
  extends Omit<ISupplier, '_id' | 'productOrders'> {
  productOrders?: Types.ObjectId[]; // IProductOrder
}

const supplierSchema = new Schema<ISupplier>(
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
  { timestamps: true },
);

const Supplier =
  (models?.Supplier as Model<ISupplier>) ||
  model<ISupplier>('Supplier', supplierSchema);
export default Supplier;
