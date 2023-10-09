import { z } from 'zod';

import { zodString, zodUuid } from './helper';
import type { StoreModel } from './store.model';

import { DayOfWeek } from 'backend/enums/Entities.enum';

const StoreWorkTimeSchema = z.object({
  id: zodUuid('StoreWorkTime.Id'),

  store: zodUuid('StoreWorkTime.StoreId'),

  dayOfWeek: z.nativeEnum(DayOfWeek, {
    required_error: 'StoreWorkTime.DayOfWeek.Required',
  }),

  openTime: zodString('StoreWorkTime.OpenTime'),

  closeTime: zodString('StoreWorkTime.CloseTime'),
});

type StoreWorkTimeModel = z.infer<typeof StoreWorkTimeSchema>;

type StoreWorkTimeReferenceKeys = keyof Pick<StoreWorkTimeModel, 'store'>;

type PopulateField<K extends keyof StoreWorkTimeModel> = K extends 'store'
  ? StoreModel
  : never;

type PopulateStoreWorkTimeFields<K extends StoreWorkTimeReferenceKeys> = Omit<
  StoreWorkTimeModel,
  K
> & {
  [P in K]: PopulateField<P>;
};

type FullyPopulatedStoreWorkTimeModel =
  PopulateStoreWorkTimeFields<StoreWorkTimeReferenceKeys>;

export { StoreWorkTimeSchema };
export type {
  StoreWorkTimeModel,
  FullyPopulatedStoreWorkTimeModel,
  PopulateStoreWorkTimeFields,
};
