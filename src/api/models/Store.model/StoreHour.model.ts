import { Schema, Types } from 'mongoose';

export interface IStoreHour {
  _id: Types.ObjectId;

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

export const storeHourSchema = new Schema(
  {
    dayOfWeek: {
      type: String,
      required: [true, 'StoreHour/DayOfWeek is required'],
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
        message: '{VALUE} in StoreHour/DayOfWeek is not supported.',
      },
    },

    openTime: {
      type: Date,
      required: [true, 'StoreHour/OpenTime is required'],
      validate: {
        validator: function (openTime: Date) {
          return openTime.getTime() < this.closeTime.getTime();
        },
        message: 'StoreHour/OpenTime should be before StoreHour/CloseTime',
      },
    },

    closeTime: {
      type: Date,
      required: [true, 'StoreHour/CloseTime is required'],
      validate: {
        validator: function (closeTime: Date) {
          return closeTime.getTime() > this.openTime.getTime();
        },
        message: 'StoreHour/CloseTime should be after StoreHour/OpenTime',
      },
    },
  },
  { collection: 'storeHours' },
);
