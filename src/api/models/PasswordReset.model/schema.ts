import { Schema } from 'mongoose';

import type { IPasswordReset } from './types';

export const passwordResetSchema = new Schema<IPasswordReset>(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'PasswordReset/Account is required'],
    },

    token: {
      type: String,
      required: [true, 'PasswordReset/Token is required'],
      trim: true,
    },

    status: {
      type: String,
      required: [true, 'PasswordReset/Status is required'],
      enum: {
        values: ['PENDING', 'RESOLVED', 'EXPIRED'],
        message: '{VALUE} in PasswordReset/Status is not supported',
      },
    },
  },
  {
    timestamps: true,
    collection: 'passwordResets',
  },
);

passwordResetSchema.virtual('expirationDate').get(function () {
  const createdAtAsMs: number = new Date(this.createdAt).getTime();
  const expirationAsMs = createdAtAsMs + 10 * 60 * 1000;
  return new Date(expirationAsMs);
});
