import { Schema, model, models } from 'mongoose';
import validator from 'validator';

import { IPasswordReset } from './PasswordReset.model';
import { IRole } from './Role.model';

import { phoneRegex } from 'helpers/regex';

export interface IAccount {
  _id: Schema.Types.ObjectId;
  role: IRole;
  passwordReset: IPasswordReset;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verified: boolean;
  password: string;
  avatarUrl: string;
}

const accountSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: [true, 'Account Role is required'],
    },

    passwordReset: {
      type: Schema.Types.ObjectId,
      ref: 'PasswordReset',
    },

    firstName: {
      type: String,
      required: [true, 'Account First name is required'],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, 'Account Last name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Account email is required'],
      validate: {
        validator: validator.isEmail,
        message: 'Invalid account email format',
      },
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Account phone is required'],
      validate: {
        validator: (value: string) => value && phoneRegex.test(value),
        message: 'Invalid account phone number format',
      },
      unique: true,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: [true, 'Account Password is required'],
      trim: true,
    },

    avatarUrl: {
      type: String,
      // required: [true, 'Account Avatar url is required'],
    },
  },
  { timestamps: true },
);

accountSchema.pre('save', function () {
  if (!this.avatarUrl || this.avatarUrl.trim().length === 0) {
    const name = `${this.firstName}+${this.lastName}`;
    this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURI(name)}`;
  }
});

const Account = models?.Account || model('Account', accountSchema);
export default Account;
