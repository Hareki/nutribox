import * as yup from 'yup';

import type { CheckoutFormValues } from 'backend/dtos/checkout.dto';
import { PHONE_REGEX } from 'constants/regex.constant';
import { transformAccountAddressToFormikValue } from 'helpers/address.helper';
import type { CommonCustomerAccountModel } from 'models/account.model';

export const getInitialValues = async (
  account: CommonCustomerAccountModel,
): Promise<CheckoutFormValues> => {
  const defaultAddress = account.customer.customerAddresses.find(
    (address) => address.isDefault,
  );
  const transformedAddressValues = await transformAccountAddressToFormikValue(
    defaultAddress!,
  );

  // if (transformedAddressValues) {
  //   delete transformedAddressValues.type;
  // }

  return {
    cartItems: account.customer.cartItems.map((item) => item.id),
    note: '',
    phone: account.customer.phone,
    ...transformedAddressValues,
  } as CheckoutFormValues;
};
// export type CheckoutFormValues = ReturnType<typeof getInitialValues>;

export const checkoutFormSchema = yup.object().shape({
  note: yup.string().max(500, 'Lời nhắn không được quá 500 ký tự'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        return originalValue.replace(/-/g, '');
      }
      return value;
    })
    .matches(PHONE_REGEX, 'Định dạng số điện thoại không hợp lệ'),
  province: yup
    .object()
    .typeError('Vui lòng nhập Tỉnh/Thành Phố')
    .required('Vui lòng nhập Tỉnh/Thành Phố'),
  district: yup
    .object()
    .typeError('Vui lòng nhập Quận/Huyện')
    .required('Vui lòng nhập Quận/Huyện'),
  ward: yup
    .object()
    .typeError('Vui lòng nhập Phường/Xã')
    .required('Vui lòng nhập Phường/Xã'),
  streetAddress: yup.string().required('Vui lòng nhập Số nhà, tên đường'),
});
