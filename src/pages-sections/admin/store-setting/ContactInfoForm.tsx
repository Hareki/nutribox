import { LoadingButton } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IStore } from 'api/models/Store.model/types';
import type { IAddress } from 'api/types/schema.type';
import { useFormik } from 'formik';
import { phoneRegex } from 'helpers/regex.helper';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import type { UpdateStoreContactInfoRb } from '../../../../pages/api/admin/store';

import apiCaller from 'api-callers/stores';
import AddressForm from 'components/AddressForm';
import PhoneInput from 'components/common/input/PhoneInput';
import {
  transformAddressToFormikValue,
  transformFormikValueToAddress,
} from 'helpers/address.helper';
import { StoreId } from 'utils/constants';

interface ContactInfoFormProps {
  initialStoreInfo: IStore;
}

export default function ContactInfoForm({
  initialStoreInfo,
}: ContactInfoFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate: updateStoreInfo, isLoading } = useMutation<
    IStore,
    unknown,
    UpdateStoreContactInfoRb
  >({
    mutationFn: (body) => apiCaller.updateStoreInfo(body),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật thông tin liên hệ thành công', {
        variant: 'success',
      });
      queryClient.invalidateQueries(['store', initialStoreInfo.id]);
    },
  });

  const getInitialValues = (initialStoreInfo: IStore) => {
    return {
      phone: initialStoreInfo?.phone || '',
      email: initialStoreInfo?.email || '',
      ...transformAddressToFormikValue(initialStoreInfo),
    };
  };

  type ShopInfoFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: ShopInfoFormValues) => {
    const address: IAddress = transformFormikValueToAddress(values);
    const input: UpdateStoreContactInfoRb = {
      id: StoreId,
      ...address,
      phone: values.phone,
      email: values.email,
    };
    updateStoreInfo(input);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<ShopInfoFormValues>({
    initialValues: getInitialValues(initialStoreInfo),
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} mb={4}>
        <Grid item md={6} xs={12}>
          {/* FIXME can generalize this "TextField with Formik" */}
          <TextField
            fullWidth
            name='phone'
            size='medium'
            label='Số điện thoại'
            placeholder='XXX-XXX-XXXX'
            onBlur={handleBlur}
            value={values.phone}
            onChange={handleChange}
            error={!!touched.phone && !!errors.phone}
            helperText={(touched.phone && errors.phone) as string}
            InputProps={{
              inputComponent: PhoneInput as any,
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            name='email'
            label='Email'
            size='medium'
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            error={!!touched.email && !!errors.email}
            helperText={(touched.email && errors.email) as string}
          />
        </Grid>

        <AddressForm
          medium
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
        />
      </Grid>

      <LoadingButton
        loading={isLoading}
        type='submit'
        variant='contained'
        color='primary'
      >
        Lưu thay đổi
      </LoadingButton>
    </form>
  );
}

const validationSchema = yup.object().shape({
  phone: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        return originalValue.replace(/-/g, '');
      }
      return value;
    })
    .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
  email: yup
    .string()
    .email('Định dạng email không hợp lệ')
    .required('Vui lòng nhập email'),
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
