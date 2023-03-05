import { Schema, model, models } from 'mongoose';

import { IStore } from './Store.model';

export interface IStoreHours {
  _id: Schema.Types.ObjectId;
  store: IStore;

  dayOfWeek: string;
  openTime: Date;
  closeTime: Date;
}

const storeHoursSchema = new Schema({
  dayOfWeek: {
    type: String,
    required: [true, 'Store hours dayOfWeek is required'],
    trim: true,
    enum: {
      values: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      message: '{VALUE} is not supported.',
    },
  },

  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store hours store is required'],
  },

  openTime: {
    type: Date,
    required: [true, 'Store hours openTime is required'],
  },

  closeTime: {
    type: Date,
    required: [true, 'Store hours closeTime is required'],
  },
});

const StoreHours = models?.StoreHours || model('StoreHours', storeHoursSchema);
export default StoreHours;
