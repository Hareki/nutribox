import { z } from 'zod';

import { PHONE_REGEX } from 'constants/regex.constant';

const SupplierSchema = z.object({
  id: z
    .string({
      required_error: 'Supplier.Id.Required',
    })
    .uuid(),
  name: z
    .string()
    .min(3, {
      message: 'Supplier.Name.Min',
    })
    .max(50, { message: 'Supplier.Name.Max' }),
  phone: z
    .string({
      required_error: 'Supplier.Phone.Required',
    })
    .regex(PHONE_REGEX, {
      message: 'Supplier.Phone.InvalidFormat',
    }),
  email: z
    .string({
      required_error: 'Supplier.Email.Required',
    })
    .email({
      message: 'Supplier.Email.InvalidFormat',
    }),
  provinceCode: z.string({
    required_error: 'Supplier.ProvinceCode.Required',
  }),
  districtCode: z.string({
    required_error: 'Supplier.DistrictCode.Required',
  }),
  wardCode: z.string({
    required_error: 'Supplier.WardCode.Required',
  }),
  streetAddress: z.string({
    required_error: 'Supplier.StreetAddress.Required',
  }),
});

type SupplierModel = z.infer<typeof SupplierSchema>;

export { SupplierSchema };
export type { SupplierModel };
