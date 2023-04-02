import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { Fragment, useState } from 'react';
import * as yup from 'yup';

import type { IAccount } from 'api/models/Account.model/types';
import { H5 } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import { isValidPassword } from 'helpers/password.helper';
import EyeToggleButton from 'pages-sections/auth/EyeToggleButton';
import apiCaller from 'utils/apiCallers/profile';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

type FormValues = typeof initialValues;

interface PasswordChangeFormProps {
  account: IAccount;
  toggleEditing: () => void;
}
const PasswordChangeForm = ({
  account,
  toggleEditing,
}: PasswordChangeFormProps) => {
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const togglePasswordVisibility = (type: 'old' | 'new') => {
    if (type === 'old') {
      setOldPasswordVisible((prev) => !prev);
    } else {
      setNewPasswordVisible((prev) => !prev);
    }
  };

  const { mutate: changePassword, isLoading: isChangingPassword } = useMutation<
    IAccount,
    unknown,
    void
  >({
    mutationFn: () =>
      apiCaller.updateAccount(account.id, {
        password: values.newPassword,
      }),
    onSuccess: () => {
      setIsEditing(false);
      enqueueSnackbar('Đổi mật khẩu thành công', {
        variant: 'success',
      });
      resetForm();
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const { mutate: checkPassword, isLoading: isCheckingPassword } = useMutation<
    boolean,
    unknown,
    void
  >({
    mutationFn: () =>
      apiCaller.checkOldPassword(account.id, values.oldPassword),
    onSuccess: (isOldPasswordValid) => {
      if (!isOldPasswordValid) {
        errors.oldPassword = 'Mật khẩu cũ không đúng';
        return;
      }

      if (values.newPassword === values.oldPassword) {
        enqueueSnackbar('Mật khẩu mới không được trùng với mật khẩu cũ', {
          variant: 'error',
        });
        return;
      }

      changePassword();
    },
    onError: (err) => {
      console.log(err);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    console.log(values);
    checkPassword();
  };

  const {
    resetForm,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Card1>
      <H5 mb={2}>Đổi mật khẩu</H5>
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
              name='newPassword'
              size='small'
              type={newPasswordVisible ? 'text' : 'password'}
              label='Mật khẩu mới'
              variant='outlined'
              onBlur={handleBlur}
              value={values.newPassword}
              onChange={handleChange}
              // placeholder='********'
              error={!!touched.newPassword && !!errors.newPassword}
              helperText={(touched.newPassword && errors.newPassword) as string}
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
              name='confirmNewPassword'
              size='small'
              type={newPasswordVisible ? 'text' : 'password'}
              label='Xác nhận mật khẩu mới'
              variant='outlined'
              onBlur={handleBlur}
              value={values.confirmNewPassword}
              onChange={handleChange}
              // placeholder='********'
              error={
                !!touched.confirmNewPassword && !!errors.confirmNewPassword
              }
              helperText={
                (touched.confirmNewPassword &&
                  errors.confirmNewPassword) as string
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
                loading={isChangingPassword || isCheckingPassword}
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
    </Card1>
  );
};

const validationSchema = yup.object().shape({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .test(
      'isValidPassword',
      'Mật khẩu phải chứa ít nhất 10 ký tự, gồm ký tự đặc biệt và số',
      (value) => isValidPassword(value),
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Xác nhận mật khẩu không khớp')
    .required('Vui lòng nhập xác nhận mật khẩu'),
});
export default PasswordChangeForm;
