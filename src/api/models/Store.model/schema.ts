import { Schema } from 'mongoose';

import { storeHourSchema } from './StoreHour.schema';
import { IStoreHour } from './StoreHour.schema/types';

import { getAddressSchema, getPhoneSchema } from 'api/helpers/schema.helper';

export const storeSchema = new Schema(
  {
    storeHours: {
      type: [storeHourSchema],
      required: [true, 'Store/StoreHours is required'],
      validate: {
        validator: (storeHours: IStoreHour[]) => {
          const daysOfWeek = storeHours.map((storeHour) => storeHour.dayOfWeek);
          const uniqueDaysOfWeek = [...new Set(daysOfWeek)];

          return (
            uniqueDaysOfWeek.length === daysOfWeek.length &&
            uniqueDaysOfWeek.length === 7
          );
        },
        message: 'Store/StoreHours should have 7 unique days of the week.',
      },
    },

    ...getPhoneSchema('Store'),

    ...getAddressSchema('Store'),
  },
  { timestamps: true },
);
