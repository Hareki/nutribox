import { z } from 'zod';

import { zodString, zodUuid } from './helper';

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

export { StoreWorkTimeSchema };
export type { StoreWorkTimeModel };
