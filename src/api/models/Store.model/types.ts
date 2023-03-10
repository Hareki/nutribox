import { Types } from 'mongoose';

import { IStoreHour } from './StoreHour.schema/types';

import { IAddress } from 'api/types/schema.type';

export interface IStore extends IAddress {
  _id: Types.ObjectId;
  id: string;
  storeHours: Types.DocumentArray<IStoreHour>; // IStoreHour

  phone: string;
}

export interface IStoreInput extends Omit<IStore, '_id'> {}
