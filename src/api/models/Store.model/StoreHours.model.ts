import { Schema } from 'mongoose';

export interface IStoreHours {
  _id: Schema.Types.ObjectId;

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
      message: '{VALUE} in StoreHours/DayOfWeek is not supported.',
    },
  },

  openTime: {
    type: Date,
    required: [true, 'StoreHours/OpenTime is required'],
    validate: {
      validator: function (openTime: Date) {
        return openTime.getTime() < this.closeTime.getTime();
      },
      message: 'StoreHours/OpenTime should be before StoreHours/CloseTime',
    },
  },

  closeTime: {
    type: Date,
    required: [true, 'StoreHours/CloseTime is required'],
    validate: {
      validator: function (closeTime: Date) {
        return closeTime.getTime() > this.openTime.getTime();
      },
      message: 'StoreHours/CloseTime should be after StoreHours/OpenTime',
    },
  },
});
