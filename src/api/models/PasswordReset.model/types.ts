import type { Types } from 'mongoose';

export interface IPasswordReset {
  // _id: Types.ObjectId;
  id: string;
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
