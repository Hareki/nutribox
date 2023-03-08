import { Schema, model, models, Types } from 'mongoose';

import { IProductOrder } from './ProductOrder.model';

import {
  getAddressSchema,
  getEmailSchema,
  getPhoneSchema,
} from 'api/helpers/schema.helper';
import { IAddress } from 'api/types/schema.type';

export interface ISupplier extends IAddress {
  _id: Types.ObjectId;
  // NOTE: We might want to see all the orders of a supplier in the future
  productOrders: IProductOrder[];

  name: string;
  phone: string;
  email: string;
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
  models?.Supplier || model<ISupplier>('Supplier', supplierSchema);
export default Supplier;
