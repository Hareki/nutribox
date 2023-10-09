import { z } from 'zod';

import { zodString, zodUuid } from './helper';

import { PHONE_REGEX } from 'constants/regex.constant';

const SupplierSchema = z.object({
  id: zodUuid('Supplier.Id'),

  name: zodString('Supplier.Name', 3, 50),

  phone: zodString('Supplier.Phone').regex(PHONE_REGEX, {
    message: 'Supplier.Phone.InvalidFormat',
  }),

  email: zodString('Supplier.Email').email({
    message: 'Supplier.Email.InvalidFormat',
  }),

  provinceCode: zodString('Supplier.ProvinceCode.Required', 1, 5),

  districtCode: zodString('Supplier.DistrictCode.Required', 1, 5),

  wardCode: zodString('Supplier.WardCode.Required', 1, 5),

  streetAddress: zodString('Supplier.StreetAddress', 1, 100),

  importedProducts: z.array(z.string().uuid()).optional(),
});

type SupplierModel = z.infer<typeof SupplierSchema>;

export { SupplierSchema };
export type { SupplierModel };
