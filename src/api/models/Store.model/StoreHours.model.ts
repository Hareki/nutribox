import { Schema } from 'mongoose';

import { IStore } from '.';

export interface IStoreHours {
  _id: Schema.Types.ObjectId;
  store: IStore;

  dayOfWeek: string;
  openTime: Date;
  closeTime: Date;
}

export const storeHoursSchema = new Schema({
  dayOfWeek: {
    type: String,
    required: [true, 'StoreHours/DayOfWeek is required'],
    trim: true,
    enum: {
      values: [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ],
      message: '{VALUE} is not supported.',
    },
  },

  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'StoreHours/Store is required'],
  },

  openTime: {
    type: Date,
    required: [true, 'StoreHours/OpenTime is required'],
  },

  closeTime: {
    type: Date,
    required: [true, 'StoreHours/CloseTime is required'],
  },
});
