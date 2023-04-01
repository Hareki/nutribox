import * as yup from 'yup';

import type { IAccount } from 'api/models/Account.model/types';
import { transformAccountAddressToFormikValue } from 'helpers/address.helper';
import { phoneRegex } from 'helpers/regex.helper';

export const getInitialValues = (account: IAccount) => {
  const defaultAddress = account.addresses.find((address) => address.isDefault);
  const transformedAddressValues =
    transformAccountAddressToFormikValue(defaultAddress);
  if (transformedAddressValues) {
    delete transformedAddressValues.title;
  }

  return {
    note: '',
    phone: account.phone,
    ...transformedAddressValues,
  };
};
export type CheckoutFormValues = ReturnType<typeof getInitialValues>;

export const checkoutFormSchema = yup.object().shape({
  note: yup.string().max(500, 'Lời nhắn không được quá 500 ký tự'),
  phone: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        return originalValue.replace(/-/g, '');
      }
      return value;
    })
    .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
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
