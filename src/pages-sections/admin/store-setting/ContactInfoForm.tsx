import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import staffStoreCaller from 'api-callers/staff/stores';
import {
  UpdateStoreInfoFormSchema,
  type UpdateStoreInfoDto,
} from 'backend/dtos/store/updateStoreInfo.dto';
import AddressForm from 'components/AddressForm';
import PhoneInput from 'components/common/input/PhoneInput';
import { STORE_ID } from 'constants/temp.constant';
import {
  transformAddressToFormikValue,
  transformFormikValueToIAddress,
} from 'helpers/address.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { PopulateStoreFields, StoreModel } from 'models/store.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

interface ContactInfoFormProps {
  initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>;
}

export default function ContactInfoForm({
  initialStoreInfo,
}: ContactInfoFormProps) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useCustomTranslation(['store', 'storeWorkTime']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Cập nhật thông tin liên hệ',
  });

  const { mutate: updateStoreInfo, isLoading } = useMutation<
    StoreModel,
    unknown,
    UpdateStoreInfoDto
  >({
    mutationFn: (dto) => staffStoreCaller.updateStoreInfo(STORE_ID, dto),
    onSuccess: () => {
      enqueueSnackbar('Cập nhật thông tin liên hệ thành công', {
        variant: 'success',
      });
      setIsEditing(false);
      queryClient.invalidateQueries(['store', initialStoreInfo.id]);
    },
    onError: dispatchErrorDialog,
  });

  const getInitialValues = (
    initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>,
  ) => {
    return {
      phone: initialStoreInfo?.phone || '',
      email: initialStoreInfo?.email || '',
      ...transformAddressToFormikValue(initialStoreInfo),
    };
  };

  type ShopInfoFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = (values: ShopInfoFormValues) => {
    const address = transformFormikValueToIAddress(values);
    const input: UpdateStoreInfoDto = {
      ...address!,
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
    resetForm,
  } = useFormik<ShopInfoFormValues>({
    enableReinitialize: true,
    initialValues: getInitialValues(initialStoreInfo),
    validationSchema: toFormikValidationSchema(UpdateStoreInfoFormSchema),
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
            helperText={t((touched.phone && errors.phone) as string)}
            InputProps={{
              readOnly: !isEditing,
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
            helperText={t((touched.email && errors.email) as string)}
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Grid>

        <AddressForm
          isEditing={isEditing}
          medium
          values={values}
          touched={touched}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
        />
      </Grid>

      {/* <LoadingButton
        loading={isLoading}
        type='submit'
        variant='contained'
        color='primary'
      >
        Lưu thay đổi
      </LoadingButton> */}

      <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
        {isEditing ? (
          <>
            <LoadingButton
              loading={isLoading}
              variant='contained'
              color='primary'
              type='submit'
            >
              Lưu thay đổi
            </LoadingButton>
            <Button
              variant='outlined'
              color='primary'
              type='submit'
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              sx={{
                px: 3,
              }}
            >
              Huỷ
            </Button>
          </>
        ) : (
          <Button
            startIcon={<EditRoundedIcon />}
            variant='contained'
            color='primary'
            type='submit'
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        )}
      </Grid>
      <ErrorDialog />
    </form>
  );
}

// const validationSchema = yup.object().shape({
//   phone: yup
//     .string()
//     .required('Vui lòng nhập số điện thoại')
//     .transform((value, originalValue) => {
//       if (originalValue && typeof originalValue === 'string') {
//         return originalValue.replace(/-/g, '');
//       }
//       return value;
//     })
//     .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
//   email: yup
//     .string()
//     .email('Định dạng email không hợp lệ')
//     .required('Vui lòng nhập email'),
//   province: yup
//     .object()
//     .typeError('Vui lòng nhập Tỉnh/Thành Phố')
//     .required('Vui lòng nhập Tỉnh/Thành Phố'),
//   district: yup
//     .object()
//     .typeError('Vui lòng nhập Quận/Huyện')
//     .required('Vui lòng nhập Quận/Huyện'),
//   ward: yup
//     .object()
//     .typeError('Vui lòng nhập Phường/Xã')
//     .required('Vui lòng nhập Phường/Xã'),
//   streetAddress: yup.string().required('Vui lòng nhập Số nhà, tên đường'),
// });
