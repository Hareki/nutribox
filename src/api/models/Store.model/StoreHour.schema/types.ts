import type { Types } from 'mongoose';

export interface IStoreHour {
  _id: Types.ObjectId;
  id: string;

  dayOfWeek:
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';
  openTime: Date;
  closeTime: Date;
}

export interface IStoreHourInput extends Omit<IStoreHour, '_id'> {}
