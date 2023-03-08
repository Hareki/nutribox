import { Schema, model, models, Types } from 'mongoose';

import { accountAddressSchema, IAccountAddress } from './AccountAddress.model';
import { cartItemSchema, ICartItem } from './CartItem.model';

import { getEmailSchema, getPhoneSchema } from 'api/helpers/schema.helper';

export interface IAccount {
  _id: Types.ObjectId;
  role: 'ADMIN' | 'CUSTOMER' | 'SUPPLIER';
  // Embedded documents can be accessed directly this way
  cartItems: Types.DocumentArray<ICartItem>; // ICartItem
  addresses: Types.DocumentArray<IAccountAddress>; // IAccountAddress

  // Populated documents need to be accessed this way
  customerOrders: Types.ObjectId[]; // ICustomerOrder
  passwordReset: Types.ObjectId; // IPasswordReset

  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  password: string;
  phone: string;
  verified: boolean;
}

const accountSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, 'Account/Role is required'],
      enum: {
        values: ['ADMIN', 'CUSTOMER', 'SUPPLIER'],
        message: '{VALUE} in Account/Role is not supported.',
      },
    },

    cartItems: {
      type: [cartItemSchema],
      default: [],
    },

    addresses: {
      type: [accountAddressSchema],
      default: [],
    },

    customerOrders: {
      type: [
        {
          ref: 'CustomerOrder',
          type: Schema.Types.ObjectId,
        },
      ],
      default: [],
    },

    passwordReset: {
      ref: 'PasswordReset',
      type: Schema.Types.ObjectId,
    },

    firstName: {
      type: String,
      required: [true, 'Account/FirstName is required'],
      minLength: [2, 'Account/FirstName should be at least 2 characters'],
      maxLength: [50, 'Account/FirstName should be at most 50 characters'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Account/LastName is required'],
      minLength: [2, 'Account/LastName should be at least 2 characters'],
      maxLength: [50, 'Account/LastName should be at most 50 characters'],
      trim: true,
    },

    avatarUrl: {
      type: String,
      required: [true, 'Account/AvatarUrl is required'],
    },

    ...getEmailSchema('Account'),

    password: {
      type: String,
      required: [true, 'Account/Password is required'],
      trim: true,
    },

    ...getPhoneSchema('Account'),

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Account = models?.Account || model('Account', accountSchema);
export default Account;
