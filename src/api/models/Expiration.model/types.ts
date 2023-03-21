import type { Types } from 'mongoose';

export interface IExpiration {
  // _id: Types.ObjectId;
  id: string;
  product: Types.ObjectId; // IProduct

  expirationDate: Date;
  quantity: number;
}

export interface IExpirationInput extends Omit<IExpiration, '_id' | 'id'> {}
