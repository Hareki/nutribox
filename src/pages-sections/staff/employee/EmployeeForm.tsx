import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Avatar,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import type { Dispatch, FC } from 'react';
import { Fragment } from 'react';

import type { NewEmployeeFormValues } from 'backend/dtos/employees/NewEmployee.dto';
import { NewEmployeeFormSchema } from 'backend/dtos/employees/NewEmployee.dto';
import { EmployeeRole } from 'backend/enums/entities.enum';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import CustomSwitch from 'components/common/input/CustomSwitch';
import PhoneInput from 'components/common/input/PhoneInput';
import CustomPickersDay from 'components/CustomPickersDay';
import InfoDialog from 'components/dialog/info-dialog';
import type {
  InfoDialogAction,
  InfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { getAvatarUrl } from 'helpers/account.helper';
import { getUserRoleName } from 'helpers/order.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { mergeTime } from 'utils/date.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const getInitialValues = (initialEmployee?: CommonEmployeeModel) => {
  const initialRole = initialEmployee?.role || EmployeeRole.CASHIER;
  return {
    firstName: initialEmployee?.firstName || '',
    lastName: initialEmployee?.lastName || '',
    phone: initialEmployee?.phone || '',
    email: initialEmployee?.email || '',
    birthday: initialEmployee?.birthday || new Date(),
    personalId: initialEmployee?.personalId || '',
    disabled: initialEmployee?.account?.disabled || false,
    role: {
      label: getUserRoleName(initialRole),
      value: initialRole,
    },
  };
};

type EmployeeFormProps = {
  employee?: CommonEmployeeModel;
  handleFormSubmit: (values: any) => void;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing?: (value: boolean) => void;
  infoState: InfoDialogState;
  dispatchInfo: Dispatch<InfoDialogAction>;
};

const Roles = [
  {
    label: getUserRoleName(EmployeeRole.MANAGER),
    value: EmployeeRole.MANAGER,
  },
  {
    label: getUserRoleName(EmployeeRole.CASHIER),
    value: EmployeeRole.CASHIER,
  },
  {
    label: getUserRoleName(EmployeeRole.SHIPPER),
    value: EmployeeRole.SHIPPER,
  },
  {
    label: getUserRoleName(EmployeeRole.WAREHOUSE_MANAGER),
    value: EmployeeRole.WAREHOUSE_MANAGER,
  },
  {
    label: getUserRoleName(EmployeeRole.WAREHOUSE_STAFF),
    value: EmployeeRole.WAREHOUSE_STAFF,
  },
];

const EmployeeForm: FC<EmployeeFormProps> = (props) => {
  const {
    handleFormSubmit,
    isLoading,
    isEditing,
    setIsEditing,
    infoState,
    dispatchInfo,
    employee,
  } = props;

  const { data: session } = useSession();
  const { t } = useCustomTranslation(['employee']);

  const isAdding = !props.employee;

  const {
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<NewEmployeeFormValues>({
    initialValues: getInitialValues(employee),
    validationSchema: toFormikValidationSchema(NewEmployeeFormSchema),
    onSubmit: handleFormSubmit,
  });

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {employee && (
            <Grid item md={12} xs={12}>
              <Avatar
                src={getAvatarUrl(employee)}
                sx={{
                  height: 64,
                  width: 64,
                  '& img': {
                    objectFit: 'contain',
                  },
                }}
              />
            </Grid>
          )}

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
              disabled={!!employee}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='personalId'
              label='Số CCCD'
              size='medium'
              placeholder='Số CCCD'
              value={values.personalId}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.personalId && !!errors.personalId}
              helperText={t(
                (touched.personalId && errors.personalId) as string,
              )}
              disabled={!!employee}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Autocomplete
              readOnly={!isEditing}
              fullWidth
              options={Roles || []}
              value={values.role}
              getOptionLabel={(option) => (option as any).label}
              onChange={(_, value) => {
                setFieldValue('role', value);
              }}
              renderInput={(params) => (
                <TextField
                  label='Vai trò'
                  placeholder='Chọn vai trò'
                  error={!!touched.role && !!errors.role}
                  helperText={t((touched.role && errors.role) as string)}
                  {...params}
                  size='medium'
                />
              )}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='lastName'
              label='Họ và tên lót nhân viên'
              size='medium'
              placeholder='Họ và tên lót nhân viên'
              value={values.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.lastName && !!errors.lastName}
              helperText={t((touched.lastName && errors.lastName) as string)}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              fullWidth
              name='firstName'
              label='Tên nhân viên'
              size='medium'
              placeholder='Tên nhân viên'
              value={values.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!touched.firstName && !!errors.firstName}
              helperText={t((touched.firstName && errors.firstName) as string)}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Ngày sinh'
                maxDate={new Date()}
                readOnly={!isEditing}
                value={values.birthday}
                inputFormat='dd/MM/yyyy'
                renderInput={(props) => (
                  <TextField
                    {...(props as any)}
                    fullWidth
                    name='birthday'
                    size='medium'
                    helperText={
                      (touched.birthday &&
                        t(errors.birthday as string)) as string
                    }
                    error={!!touched.birthday && !!errors.birthday}
                  />
                )}
                onChange={(newValue) =>
                  setFieldValue(
                    'birthday',
                    mergeTime(newValue || new Date(), new Date()),
                  )
                }
                renderDay={(_, __, pickersDayProps) => (
                  <CustomPickersDay
                    {...(pickersDayProps as any)}
                    selected_color='white'
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {!!employee?.account && (
            <Grid item md={6} xs={12}>
              <FormGroup
                sx={{
                  margin: '0',
                  '& .MuiFormControlLabel-root': {
                    margin: '0',
                  },
                }}
              >
                <FormControlLabel
                  sx={{
                    '& .MuiFormControlLabel-label.Mui-disabled': {
                      color: 'text.primary',
                    },
                    alignItems: 'flex-start',
                  }}
                  labelPlacement='top'
                  control={
                    <CustomSwitch
                      disabled={!isEditing}
                      color='primary'
                      checked={!values.disabled}
                      onChange={(e) => {
                        setFieldValue('disabled', !e.target.checked);
                      }}
                    />
                  }
                  label='Hoạt động'
                />
              </FormGroup>
            </Grid>
          )}

          {session?.employeeAccount.employee.id !== employee?.id && (
            <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
              {isEditing ? (
                <Fragment>
                  <LoadingButton
                    loading={isLoading}
                    variant='contained'
                    color='primary'
                    type='submit'
                  >
                    {isAdding ? 'Thêm nhân viên' : 'Lưu thay đổi'}
                  </LoadingButton>
                  {!isAdding && (
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={() => {
                        setIsEditing?.(false);
                        resetForm({
                          values: getInitialValues(props.employee),
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

export default EmployeeForm;
