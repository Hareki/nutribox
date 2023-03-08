import { Schema, model, models } from 'mongoose';

import { IStoreHours, storeHoursSchema } from './StoreHours.model';

import { getAddressSchema, getPhoneSchema } from 'api/helpers/schema.helper';
import { IAddress } from 'api/types';

export interface IStore extends IAddress {
  _id: Schema.Types.ObjectId;
  storeHours: IStoreHours[];

  phone: string;
}

const storeSchema = new Schema(
  {
    storeHours: {
      type: [storeHoursSchema],
      required: [true, 'Store/StoreHours is required'],
      validate: {
        validator: (storeHours: IStoreHours[]) => {
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

const Store = models?.Store || model('Store', storeSchema);
export default Store;
