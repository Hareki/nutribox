import type { Types } from 'mongoose';

export interface IStoreHour {
  // _id: Types.ObjectId;
  id: string;

  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  openTime: string;
  closeTime: string;
}

export interface IStoreHourWithObjectId extends Omit<IStoreHour, 'id'> {
  _id: Types.ObjectId;
}

export interface IStoreHourInput
  extends Omit<IStoreHour, '_id' | 'id' | 'openTime' | 'closeTime'> {
  openTime: Date;
  closeTime: Date;
}
