import type { z } from 'zod';

import { StoreWorkTimeSchema } from 'models/storeWorkTime.model';

export const UpdateStoreWorkTimesDtoSchema = StoreWorkTimeSchema.pick({
  dayOfWeek: true,
  openTime: true,
  closeTime: true,
})
  .array()
  .length(7);

export type UpdateStoreWorkTimesDto = z.infer<
  typeof UpdateStoreWorkTimesDtoSchema
>;
