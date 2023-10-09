import { z } from 'zod';

import { zodString, zodUuid } from './helper';
import type { StoreWorkTimeModel } from './storeWorkTime.model';

import { PHONE_REGEX } from 'constants/regex.constant';

const StoreSchema = z.object({
  id: zodUuid('Store.Id'),

  email: zodString('Store.Email').email({
    message: 'Store.Email.InvalidFormat',
  }),

  phone: zodString('Store.Phone').regex(PHONE_REGEX, {
    message: 'Store.Phone.InvalidFormat',
  }),

  provinceCode: zodString('Store.ProvinceCode', 1, 5),

  districtCode: zodString('Store.DistrictCode', 1, 5),

  wardCode: zodString('Store.WardCode', 1, 5),

  streetAddress: zodString('Store.StreetAddress', 1, 100),

  storeWorkTimes: z.array(z.string().uuid().length(7)),
});

type StoreModel = z.infer<typeof StoreSchema>;

type StoreReferenceKeys = keyof Pick<StoreModel, 'storeWorkTimes'>;

type PopulateField<K extends keyof StoreModel> = K extends 'storeWorkTimes'
  ? StoreWorkTimeModel[]
  : never;

type PopulateStoreFields<K extends StoreReferenceKeys> = Omit<StoreModel, K> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedStoreModel = PopulateStoreFields<StoreReferenceKeys>;

export { StoreSchema };
export type { StoreModel, FullyPopulatedStoreModel, PopulateStoreFields };
