import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import type { Dispatch, FC } from 'react';
import { Fragment } from 'react';

import type { SupplierFormValues } from 'backend/dtos/suppliers/newSupplier.dto';
import { SupplierFormSchema } from 'backend/dtos/suppliers/newSupplier.dto';
import { EmployeeRole } from 'backend/enums/entities.enum';
import AddressForm from 'components/AddressForm';
import PhoneInput from 'components/common/input/PhoneInput';
import InfoDialog from 'components/dialog/info-dialog';
import type {
  InfoDialogAction,
  InfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { transformAddressToFormikValue } from 'helpers/address.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { SupplierModel } from 'models/supplier.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const getInitialValues = (initialSupplier?: SupplierModel) => {
  let addressFormikValue: any = {
    province: null,
    district: null,
    ward: null,
    streetAddress: '',
  };
  if (initialSupplier) {
    addressFormikValue = transformAddressToFormikValue(initialSupplier);
  }
  return {
    name: initialSupplier?.name || '',
    phone: initialSupplier?.phone || '',
    email: initialSupplier?.email || '',
    ...addressFormikValue,
  };
};

type SupplierFormProps = {
  supplier?: SupplierModel;
  handleFormSubmit: (values: any) => void;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing?: (value: boolean) => void;
  infoState: InfoDialogState;
  dispatchInfo: Dispatch<InfoDialogAction>;
};

const SupplierForm: FC<SupplierFormProps> = (props) => {
  const {
    handleFormSubmit,
    isLoading,
    isEditing,
    setIsEditing,
    infoState,
    dispatchInfo,
  } = props;

  const { t } = useCustomTranslation(['supplier']);

  const { data: session } = useSession();
  const isAuthorizedToMutate =
    session?.employeeAccount.employee.role !== EmployeeRole.MANAGER;

  const isAdding = !props.supplier;

  const {
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<SupplierFormValues>({
    initialValues: getInitialValues(props.supplier),
    validationSchema: toFormikValidationSchema(SupplierFormSchema),
    onSubmit: handleFormSubmit,
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='name'
              label='Tên nhà cung cấp'
              size='medium'
              placeholder='Tên nhà cung cấp'
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.name && !!errors.name}
              helperText={t((touched.name && errors.name) as string)}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='phone'
              label='Số điện thoại'
              size='medium'
              placeholder='Số điện thoại'
              value={values.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.phone && !!errors.phone}
              helperText={t((touched.phone && errors.phone) as string)}
              InputProps={{
                inputComponent: PhoneInput as any,
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='email'
              label='Email'
              size='medium'
              placeholder='Email'
              value={values.email}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.email && !!errors.email}
              helperText={t((touched.email && errors.email) as string)}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <AddressForm
            values={values}
            touched={touched}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            medium
            isEditing={isEditing}
          />

          {isAuthorizedToMutate && (
            <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
              {isEditing ? (
                <Fragment>
                  <LoadingButton
                    loading={isLoading}
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    {isAdding ? 'Thêm nhà CC' : 'Lưu thay đổi'}
                  </LoadingButton>
                  {!isAdding && (
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        setIsEditing?.(false);
                        resetForm({
                          values: getInitialValues(props.supplier),
                        });
                      }}
                      sx={{
                        px: 3,
                      }}
                    >
                      Hủy
                    </Button>
                  )}
                </Fragment>
              ) : (
                <Button
                  startIcon={<EditRoundedIcon />}
                  variant='contained'
                  color='primary'
                  type='submit'
                  onClick={() => setIsEditing?.(true)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Grid>
          )}
        </Grid>
      </form>

      <InfoDialog
        open={infoState.open}
        content={infoState.content}
        title={infoState.title}
        variant={infoState.variant}
        handleClose={() => dispatchInfo({ type: 'close_dialog' })}
      />
    </Fragment>
  );
};

// const validationSchema = yup.object().shape({
//   name: yup
//     .string()
//     .required('Vui lòng nhập tên nhà cung cấp')
//     .max(100, 'Tên sản phẩm không được quá 100 ký tự'),
//   // FIXME: Generalize phone validation
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
//   // FIXME: Generalize address validation
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

export default SupplierForm;
