import { Autocomplete, Grid, TextField } from '@mui/material';
import type { FormikHandlers, FormikHelpers } from 'formik';
import { Fragment } from 'react';

import type { AddressAPI } from 'backend/dtos/checkout.dto';
import { useAddressQuery } from 'hooks/useAddressQuery';
import { useCustomTranslation } from 'hooks/useCustomTranslation';

type AddressFormProps = {
  values: {
    province: AddressAPI;
    district: AddressAPI;
    ward: AddressAPI;
    streetAddress: string;
  };
  touched: any;
  errors: any;
  handleChange: FormikHandlers['handleChange'];
  handleBlur: FormikHandlers['handleBlur'];
  setFieldValue: FormikHelpers<any>['setFieldValue'];

  medium?: boolean;
  isEditing?: boolean;
};

const AddressForm = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
  medium = false,
  isEditing = true,
}: AddressFormProps) => {
  const { t } = useCustomTranslation(['customerAddress']);

  const {
    provinces,
    isLoadingProvince,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
    hasProvince,
    hasDistrict,
  } = useAddressQuery(values);

  return (
    <Fragment>
      <Grid item md={6} xs={12}>
        <Autocomplete
          readOnly={!isEditing}
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
              helperText={t((touched.province && errors.province) as string)}
              {...params}
              size={medium ? 'medium' : 'small'}
            />
          )}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Autocomplete
          readOnly={!isEditing}
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
              helperText={t((touched.district && errors.district) as string)}
              {...params}
              size={medium ? 'medium' : 'small'}
            />
          )}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <Autocomplete
          readOnly={!isEditing}
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
              helperText={t((touched.ward && errors.ward) as string)}
              {...params}
              size={medium ? 'medium' : 'small'}
            />
          )}
        />
      </Grid>

      <Grid item md={6} xs={12}>
        <TextField
          fullWidth
          size={medium ? 'medium' : 'small'}
          name='streetAddress'
          label='Số nhà, tên đường'
          onBlur={handleBlur}
          value={values.streetAddress}
          onChange={handleChange}
          error={!!touched.streetAddress && !!errors.streetAddress}
          helperText={t(
            (touched.streetAddress && errors.streetAddress) as string,
          )}
          InputProps={{
            readOnly: !isEditing,
          }}
        />
      </Grid>
    </Fragment>
  );
};

export default AddressForm;
