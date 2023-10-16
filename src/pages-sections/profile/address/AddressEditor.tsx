import { Place } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { NextPage } from 'next';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

import type { AddAddressRequestBody } from '../../../../pages/api/profile/address/[accountId]';

import type { IAccountAddress } from 'api/models/Account.model/AccountAddress.schema/types';
import AddressForm from 'components/AddressForm';
import Card1 from 'components/common/Card1';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { transformAccountAddressToFormikValue } from 'helpers/address.helper';
import addressCaller from 'api-callers/profile/addresses';

type MutateAddressVariables = {
  type: 'add' | 'edit';
  baseBody: AddAddressRequestBody;
};

type AddressEditorProps = {
  accountId: string;
  editingAddress: IAccountAddress;
  setEditingAddress: (info: IAccountAddress) => void;
  isAddMode: boolean;
  setIsAddMode: (isAddMode: boolean) => void;
};

const AddressEditor: NextPage<AddressEditorProps> = ({
  accountId,
  editingAddress,
  setEditingAddress,
  isAddMode,
  setIsAddMode,
}) => {
  const goBack = () => {
    setIsAddMode(false);
    setEditingAddress(null);
  };

  const HEADER_LINK = (
    <Button
      color='primary'
      sx={{ bgcolor: 'primary.light', px: 4 }}
      onClick={() => goBack()}
    >
      Huỷ bỏ
    </Button>
  );

  const getInitialValues = (editingAddress: IAccountAddress) => {
    console.log(
      'file: AddressEditor.tsx:75 - getInitialValues - editingAddress:',
      editingAddress,
    );

    if (editingAddress) {
      return transformAccountAddressToFormikValue(editingAddress);
    } else {
      return {
        title: '',
        province: null,
        district: null,
        ward: null,
        streetAddress: '',
      };
    }
  };

  type AddressFormValues = ReturnType<typeof getInitialValues>;

  const handleFormSubmit = async (values: AddressFormValues) => {
    const type = isAddMode ? 'add' : 'edit';
    let isDefault = false;
    if (isAddMode) {
      const addresses = await addressCaller.getAddresses(accountId);
      isDefault = addresses.length === 0;
    }
    const body = {
      title: values.title,
      province: values.province.name,
      district: values.district.name,
      ward: values.ward.name,
      streetAddress: values.streetAddress,

      provinceId: values.province.code,
      districtId: values.district.code,
      wardId: values.ward.code,
      isDefault,
    };
    console.log('file: AddressEditor.tsx:48 - handleFormSubmit - body:', body);

    mutateAddress({ type, baseBody: body });
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<AddressFormValues>({
    initialValues: getInitialValues(editingAddress),
    validationSchema: addressSchema,
    onSubmit: handleFormSubmit,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: mutateAddress, isLoading: isMutating } = useMutation<
    IAccountAddress[],
    unknown,
    MutateAddressVariables
  >({
    mutationFn: ({ type, baseBody: body }) => {
      if (type === 'add') {
        return addressCaller.addAddress(accountId, body);
      } else {
        return addressCaller.updateAddress(accountId, {
          ...body,
          id: editingAddress.id,
        });
      }
    },
    onSuccess: (newAddresses) => {
      queryClient.invalidateQueries(['addresses', accountId]);
      queryClient.setQueryData(['addresses', accountId], newAddresses);
      enqueueSnackbar(
        isAddMode ? 'Thêm địa chỉ thành công' : 'Sửa địa chỉ thành công',
        { variant: 'success' },
      );
      goBack();
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  return (
    <>
      <UserDashboardHeader
        icon={Place}
        button={HEADER_LINK}
        title={isAddMode ? 'Thêm địa chỉ' : 'Chỉnh sửa địa chỉ'}
        navigation={<CustomerDashboardNavigation />}
      />

      <Card1>
        <form onSubmit={handleSubmit}>
          <Box mb={4}>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name='title'
                  label='Tên địa chỉ'
                  onBlur={handleBlur}
                  value={values.title}
                  onChange={handleChange}
                  error={!!touched.title && !!errors.title}
                  helperText={(touched.title && errors.title) as string}
                />
              </Grid>

              <AddressForm
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
              />
            </Grid>
          </Box>

          <LoadingButton
            loading={isMutating}
            type='submit'
            variant='contained'
            color='primary'
          >
            {isAddMode ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
          </LoadingButton>
        </form>
      </Card1>
    </>
  );
};

const addressSchema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tên địa chỉ'),
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

export default AddressEditor;
