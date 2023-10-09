import { z } from 'zod';

import { zodString, zodUuid } from './helper';

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
});

type StoreModel = z.infer<typeof StoreSchema>;

export { StoreSchema };
export type { StoreModel };
