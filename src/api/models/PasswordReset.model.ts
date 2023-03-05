import { model, models, Schema } from 'mongoose';

import { IAccount } from './Account.model';

export interface IPasswordReset {
  _id: Schema.Types.ObjectId;
  account: IAccount;
  token: string;
  status: 'pending' | 'resolved' | 'expired';
  expirationDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

const passwordResetSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account for password reset is required'],
    },

    token: {
      type: String,
      required: [true, 'Password reset token is required'],
      trim: true,
    },

    status: {
      type: String,
      required: [true, 'Password reset status is required'],
      enum: {
        values: ['pending', 'resolved', 'expired'],
        message: '{VALUE} is not supported',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

passwordResetSchema.virtual('expirationDate').get(function () {
  const createdAtAsMs: number = new Date(this.createdAt).getTime();
  const expirationAsMs = createdAtAsMs + 10 * 60 * 1000;
  return new Date(expirationAsMs);
});

const PasswordReset =
  models['PasswordReset'] || model('PasswordReset', passwordResetSchema);
export default PasswordReset;
