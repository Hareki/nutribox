import { z } from 'zod';

import { zodDate, zodNumber, zodPhone, zodString, zodUuid } from './helper';
import type { StoreWorkTimeModel } from './storeWorkTime.model';

const StoreSchema = z.object({
  id: zodUuid('Store.Id'),

  createdAt: zodDate('Store.CreatedAt'),

  storeWorkTimes: z.array(z.string().uuid().length(7)),

  email: zodString('Store.Email').email({
    message: 'Store.Email.InvalidFormat',
  }),

  phone: zodPhone('Store.Phone'),

  provinceCode: zodNumber('CustomerAddress.ProvinceCode', 'int', 1, 10_000),

  districtCode: zodNumber('CustomerAddress.DistrictCode', 'int', 1, 10_000),

  wardCode: zodNumber('CustomerAddress.WardCode', 'int', 1, 100_000),

  provinceName: zodString('CustomerAddress.ProvinceName', 1, 50),

  districtName: zodString('CustomerAddress.ProvinceName', 1, 50),

  wardName: zodString('CustomerAddress.ProvinceName', 1, 50),

  streetAddress: zodString('Store.StreetAddress', 1, 100),
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
