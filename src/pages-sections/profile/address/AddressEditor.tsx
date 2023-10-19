import { Place } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { NextPage } from 'next';
import { useSnackbar } from 'notistack';

import addressCaller from 'api-callers/profile/addresses';
import {
  CustomerAddressFormSchema,
  type CustomerAddressFormValues,
  type NewCustomerAddressDto,
} from 'backend/dtos/profile/addresses/newCustomerAddress.dto';
import AddressForm from 'components/AddressForm';
import Card1 from 'components/common/Card1';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { transformAccountAddressToFormikValue } from 'helpers/address.helper';
import type { CustomerAddressModel } from 'models/customerAddress.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

type MutateAddressVariables = {
  type: 'add' | 'edit';
  baseBody: NewCustomerAddressDto;
};

type AddressEditorProps = {
  accountId: string;
  editingAddress: CustomerAddressModel;
  setEditingAddress: (info: CustomerAddressModel | undefined) => void;
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
    setEditingAddress(undefined);
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

  const getInitialValues = (editingAddress: CustomerAddressModel) => {
    if (editingAddress) {
      return transformAccountAddressToFormikValue(editingAddress);
    } else {
      return {
        isDefault: false,
        title: '',
        province: null as any,
        district: null as any,
        ward: null as any,
        streetAddress: '',
      };
    }
  };

  const handleFormSubmit = async (values: CustomerAddressFormValues) => {
    const type = isAddMode ? 'add' : 'edit';
    let isDefault = false;
    if (isAddMode) {
      const addresses = await addressCaller.getAddresses();
      isDefault = addresses.length === 0;
    }
    const body = {
      title: values.title,
      province: values.province.name,
      district: values.district.name,
      ward: values.ward.name,
      streetAddress: values.streetAddress,

      provinceCode: values.province.code,
      districtCode: values.district.code,
      wardCode: values.ward.code,
      isDefault,
    };

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
  } = useFormik<CustomerAddressFormValues>({
    initialValues: getInitialValues(editingAddress),
    validationSchema: toFormikValidationSchema(CustomerAddressFormSchema),
    onSubmit: handleFormSubmit,
  });

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: mutateAddress, isLoading: isMutating } = useMutation<
    CustomerAddressModel[],
    unknown,
    MutateAddressVariables
  >({
    mutationFn: ({ type, baseBody: body }) => {
      if (type === 'add') {
        return addressCaller.addAddress(body);
      } else {
        return addressCaller.updateAddress(editingAddress.id, body);
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
            onClick={() =>
              console.log(
                'values: ',
                values,
                'errors: ',
                errors,
                'touched: ',
                touched,
              )
            }
          >
            {isAddMode ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
          </LoadingButton>
        </form>
      </Card1>
    </>
  );
};

export default AddressEditor;
