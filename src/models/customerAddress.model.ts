import { z } from 'zod';

import { zodString, zodUuid } from './helper';

import { CustomerAddressType } from 'backend/enums/Entities.enum';

const CustomerAddressSchema = z.object({
  id: zodUuid('CustomerAddress.Id'),
  customerId: zodUuid('CustomerAddress.CustomerId'),
  provinceCode: zodString('CustomerAddress.ProvinceCode', 1, 50),
  districtCode: zodString('CustomerAddress.DistrictCode', 1, 50),
  wardCode: zodString('CustomerAddress.WardCode', 1, 50),
  streetAddress: zodString('CustomerAddress.StreetAddress', 1, 500),
  isDefault: z.boolean({
    required_error: 'CustomerAddress.IsDefault.Required',
  }),
  type: z.nativeEnum(CustomerAddressType, {
    required_error: 'CustomerAddress.Type.Required',
  }),
});

type CustomerAddressModel = z.infer<typeof CustomerAddressSchema>;

export { CustomerAddressSchema };
export type { CustomerAddressModel };
