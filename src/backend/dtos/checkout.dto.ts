import { z } from 'zod';

import { CustomerSchema } from 'models/customer.model';
import { CustomerOrderSchema } from 'models/customerOrder.model';
export const CheckoutDtoSchema = z.intersection(
  CustomerOrderSchema.pick({
    phone: true,
    note: true,
    provinceCode: true,
    districtCode: true,
    wardCode: true,
    streetAddress: true,
  }),
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

export type CheckoutFormValues = Omit<
  CheckoutDto,
  'provinceCode' | 'districtCode' | 'wardCode'
> & {
  province: AddressAPI;
  district: AddressAPI;
  ward: AddressAPI;
};
