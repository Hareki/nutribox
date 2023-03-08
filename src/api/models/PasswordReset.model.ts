import { Schema, model, models, Types, Model } from 'mongoose';

export interface IPasswordReset {
  _id: Types.ObjectId;
  status: 'PENDING' | 'RESOLVED' | 'EXPIRED';
  account: Types.ObjectId; // IAccount

  token: string;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
}

export interface IPasswordResetInput
  extends Omit<
    IPasswordReset,
    '_id' | 'createdAt' | 'updatedAt' | 'expirationDate'
  > {}

const passwordResetSchema = new Schema<IPasswordReset>(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'passwordResets',
  },
);

passwordResetSchema.virtual('expirationDate').get(function () {
  const createdAtAsMs: number = new Date(this.createdAt).getTime();
  const expirationAsMs = createdAtAsMs + 10 * 60 * 1000;
  return new Date(expirationAsMs);
});

const PasswordReset =
  (models?.PasswordReset as Model<IPasswordReset>) ||
  model<IPasswordReset>('PasswordReset', passwordResetSchema);
export default PasswordReset;
