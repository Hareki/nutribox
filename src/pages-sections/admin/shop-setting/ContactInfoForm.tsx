import { LoadingButton } from '@mui/lab';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import PhoneInput from 'components/common/input/PhoneInput';
import { phoneRegex } from 'helpers/regex.helper';
import { useAddressQuery } from 'hooks/useAddressQuery';
import type { AddressAPI } from 'utils/apiCallers/profile/address';

export default function ContactInfoForm() {
  const getInitialValues = () => ({
    phone: '',
    email: '',
    province: null,
    district: null,
    ward: null,
    streetAddress: '',
  });

  type ShopInfoFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: ShopInfoFormValues) => {
    console.log(values);
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
    initialValues: getInitialValues(),
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
        loading={false}
        type='submit'
        variant='contained'
        color='primary'
      >
        Cập nhật
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
