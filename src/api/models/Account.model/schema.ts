import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';

import { accountAddressSchema } from './AccountAddress.schema';
import { cartItemSchema } from './CartItem.schema';
import type { IAccount } from './types';

import { getEmailSchema, getPhoneSchema } from 'api/helpers/schema.helper';

export const accountSchema = new Schema<IAccount>(
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

    birthday: {
      type: String,
      required: [true, 'Account/Birthday is required'],
    },

    avatarUrl: {
      type: String,
      get: function (avatarUrl: string) {
        if (avatarUrl) {
          return avatarUrl;
        } else {
          const urlName = encodeURIComponent(
            `${this.lastName} ${this.firstName}`,
          );

          return `https://ui-avatars.com/api/?name=${urlName}&background=3bb77e`;
        }
      },
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

    verificationToken: {
      type: String,
    },

    verificationTokenExpires: {
      type: Date,
    },

    forgotPasswordToken: {
      type: String,
    },

    forgotPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// accountSchema.pre('save', function (next) {
//   if (!this.avatarUrl) {
//     this.avatarUrl = `https://ui-avatars.com/api/?name=${this.lastName}+${this.firstName}&background=3bb77e`;
//   }
//   next();
// });

accountSchema.methods.isPasswordMatch = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

// Eastern name order, so the fullName will be reversed (lastName + firstName)
accountSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`;
});
