import { z } from 'zod';

import { CustomerSchema } from 'models/customer.model';
import { CustomerOrderSchema } from 'models/customerOrder.model';
import { zodPhone } from 'models/helper';

const BaseValidation = CustomerOrderSchema.pick({
  phone: true,
  note: true,
  provinceCode: true,
  districtCode: true,
  wardCode: true,
  streetAddress: true,
});

export const CheckoutDtoSchema = z.intersection(
  BaseValidation,
  z
    .object({
      cartItems: CustomerSchema.shape.cartItems, // ids of cart items need checkout
    })
    .required(),
);

export type CheckoutDto = z.infer<typeof CheckoutDtoSchema>;

export type AddressAPI = {
  code: number;
  name: string;
};

export const CheckoutFormSchema = BaseValidation.omit({
  phone: true,
  provinceCode: true,
  districtCode: true,
  wardCode: true,
}).extend({
  phone: zodPhone('CustomerOrder.Phone'),
  province: z.object(
    {
      code: CustomerOrderSchema.shape.provinceCode,
      name: CustomerOrderSchema.shape.provinceName,
    },
    {
      required_error: 'CustomerOrder.ProvinceCode.Required',
      invalid_type_error: 'CustomerOrder.ProvinceCode.Required',
    },
  ),
  district: z.object(
    {
      code: CustomerOrderSchema.shape.districtCode,
      name: CustomerOrderSchema.shape.districtName,
    },
    {
      required_error: 'CustomerOrder.DistrictCode.Required',
      invalid_type_error: 'CustomerOrder.DistrictCode.Required',
    },
  ),
  ward: z.object(
    {
      code: CustomerOrderSchema.shape.wardCode,
      name: CustomerOrderSchema.shape.wardName,
    },
    {
      required_error: 'CustomerOrder.WardCode.Required',
      invalid_type_error: 'CustomerOrder.WardCode.Required',
    },
  ),
});

export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;

// export type CheckoutFormValues = Omit<
//   CheckoutDto,
//   'provinceCode' | 'districtCode' | 'wardCode'
// > & {
//   province: AddressAPI;
//   district: AddressAPI;
//   ward: AddressAPI;
// };
