import { LoadingButton } from '@mui/lab';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import type { UpdateStoreContactInfoRb } from '../../../../pages/api/admin/store';

import type { IStore } from 'api/models/Store.model/types';
import type { IAddress } from 'api/types/schema.type';
import PhoneInput from 'components/common/input/PhoneInput';
import {
  transformAddressToFormikValue,
  transformFormikValueToAddress,
} from 'helpers/address.helper';
import { phoneRegex } from 'helpers/regex.helper';
import { useAddressQuery } from 'hooks/useAddressQuery';
import apiCaller from 'utils/apiCallers/admin/store';
import type { AddressAPI } from 'utils/apiCallers/profile/address';
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

  const hasProvince = values.province !== null;
  const hasDistrict = values.district !== null;

  const {
    provinces,
    isLoadingProvince,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
  } = useAddressQuery(values, hasProvince, hasDistrict);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3} mb={4}>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            name='phone'
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
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            error={!!touched.email && !!errors.email}
            helperText={(touched.email && errors.email) as string}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <Autocomplete
            fullWidth
            options={provinces || []}
            disabled={isLoadingProvince}
            value={values.province}
            getOptionLabel={(option) => (option as AddressAPI).name}
            onChange={(_, value) => {
              setFieldValue('province', value);
              setFieldValue('district', null);
              setFieldValue('ward', null);
            }}
            renderInput={(params) => (
              <TextField
                label='Tỉnh/Thành phố'
                placeholder='Chọn Tỉnh/Thành phố'
                error={!!touched.province && !!errors.province}
                helperText={(touched.province && errors.province) as string}
                {...params}
              />
            )}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <Autocomplete
            fullWidth
            options={districts || []}
            disabled={!hasProvince || isLoadingDistricts}
            value={values.district}
            getOptionLabel={(option) => (option as AddressAPI).name}
            onChange={(_, value) => {
              setFieldValue('district', value);
              setFieldValue('ward', null);
            }}
            renderInput={(params) => (
              <TextField
                label='Quận/Huyện'
                placeholder='Chọn Quận/Huyện'
                error={!!touched.district && !!errors.district}
                helperText={(touched.district && errors.district) as string}
                {...params}
              />
            )}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <Autocomplete
            fullWidth
            options={wards || []}
            disabled={!hasDistrict || isLoadingWards}
            value={values.ward}
            getOptionLabel={(option) => (option as AddressAPI).name}
            onChange={(_, value) => setFieldValue('ward', value)}
            renderInput={(params) => (
              <TextField
                label='Phường/Xã'
                placeholder='Chọn Phường/Xã'
                error={!!touched.ward && !!errors.ward}
                helperText={(touched.ward && errors.ward) as string}
                {...params}
              />
            )}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            name='streetAddress'
            label='Số nhà, tên đường'
            onBlur={handleBlur}
            value={values.streetAddress}
            onChange={handleChange}
            error={!!touched.streetAddress && !!errors.streetAddress}
            helperText={
              (touched.streetAddress && errors.streetAddress) as string
            }
          />
        </Grid>
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
