import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { Fragment, useState } from 'react';

import profileCaller from 'api-callers/profile';
import {
  ChangePasswordFormValueSchema,
  type ChangePasswordFormValues,
} from 'backend/dtos/password/changePassword.dto';
import { H5 } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import type { AxiosErrorWithMessages } from 'helpers/error.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { FullyPopulatedAccountModel } from 'models/account.model';
import EyeToggleButton from 'pages-sections/auth/EyeToggleButton';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const initialValues: ChangePasswordFormValues = {
  oldPassword: '',
  password: '',
  confirmPassword: '',
};

const PasswordChangeForm = () => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useCustomTranslation(['customer', 'account']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Đổi mật khẩu',
  });

  const togglePasswordVisibility = (type: 'old' | 'new') => {
    if (type === 'old') {
      setOldPasswordVisible((prev) => !prev);
    } else {
      setNewPasswordVisible((prev) => !prev);
    }
  };

  const { mutate: changePassword, isLoading: isChangingPassword } = useMutation<
    FullyPopulatedAccountModel,
    AxiosErrorWithMessages,
    ChangePasswordFormValues
  >({
    mutationFn: (values) =>
      profileCaller.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.password,
      }),
    onSuccess: () => {
      setIsEditing(false);
      enqueueSnackbar('Đổi mật khẩu thành công', {
        variant: 'success',
      });
      resetForm();
    },
    onError: dispatchErrorDialog,
  });

  const handleFormSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values);
  };

  const {
    resetForm,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<ChangePasswordFormValues>({
    initialValues,
    validationSchema: toFormikValidationSchema(ChangePasswordFormValueSchema),
    onSubmit: handleFormSubmit,
  });

  return (
    <Card1>
      <H5 mb={2}>Mật khẩu</H5>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!isEditing}
              fullWidth
              name='oldPassword'
              size='small'
              type={oldPasswordVisible ? 'text' : 'password'}
              label='Mật khẩu cũ'
              variant='outlined'
              onBlur={handleBlur}
              value={values.oldPassword}
              onChange={handleChange}
              // placeholder='********'
              error={!!touched.oldPassword && !!errors.oldPassword}
              helperText={(touched.oldPassword && errors.oldPassword) as string}
              InputProps={{
                endAdornment: (
                  <EyeToggleButton
                    show={oldPasswordVisible}
                    click={() => togglePasswordVisibility('old')}
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              disabled={!isEditing}
              fullWidth
              name='password'
              size='small'
              type={newPasswordVisible ? 'text' : 'password'}
              label='Mật khẩu mới'
              variant='outlined'
              onBlur={handleBlur}
              value={values.password}
              onChange={handleChange}
              // placeholder='********'
              error={!!touched.password && !!errors.password}
              helperText={(touched.password && errors.password) as string}
              InputProps={{
                endAdornment: (
                  <EyeToggleButton
                    show={newPasswordVisible}
                    click={() => togglePasswordVisibility('new')}
                  />
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              disabled={!isEditing}
              fullWidth
              name='confirmPassword'
              size='small'
              type={newPasswordVisible ? 'text' : 'password'}
              label='Xác nhận mật khẩu mới'
              variant='outlined'
              onBlur={handleBlur}
              value={values.confirmPassword}
              onChange={handleChange}
              // placeholder='********'
              error={!!touched.confirmPassword && !!errors.confirmPassword}
              helperText={
                (touched.confirmPassword && errors.confirmPassword) as string
              }
              InputProps={{
                endAdornment: (
                  <EyeToggleButton
                    show={newPasswordVisible}
                    click={() => togglePasswordVisibility('new')}
                  />
                ),
              }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
          {isEditing ? (
            <Fragment>
              <LoadingButton
                loading={isChangingPassword}
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
            </Fragment>
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
      </form>
      <ErrorDialog />
    </Card1>
  );
};
export default PasswordChangeForm;
