// TODO: Đây là trang dùng để edit profile
import { CameraEnhance } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { IKUpload } from 'imagekitio-react';
import { useSnackbar } from 'notistack';
import { useState, useRef, Fragment } from 'react';
import * as yup from 'yup';

import type { UpdateAccountRequestBody } from '../../../../pages/api/profile/[id]';

import type { IAccount } from 'api/models/Account.model/types';
import { H5 } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import PhoneInput from 'components/common/input/PhoneInput';
import { FlexBox } from 'components/flex-box';
import { getAvatarUrl } from 'helpers/account.helper';
import { phoneRegex } from 'helpers/regex.helper';
import { reloadSession } from 'helpers/session.helper';
import apiCaller from 'utils/apiCallers/profile';
import { IKPublicContext } from 'utils/constants';

interface ProfileFormProps {
  account: IAccount;
  toggleEditing: () => void;
}

interface UploadSuccessResponse {
  url: string;
}

const ProfileForm = ({ account, toggleEditing }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const uploadRef = useRef<HTMLInputElement>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { mutate: updateAccount, isLoading } = useMutation<
    IAccount,
    any,
    UpdateAccountRequestBody
  >({
    mutationFn: (body) => apiCaller.updateAccount(account.id, body),
    onSuccess: () => {
      reloadSession();
      enqueueSnackbar('Chỉnh sửa thông tin thành công', { variant: 'success' });
      queryClient.invalidateQueries(['account']);
      setIsEditing(false);
      //   toggleEditing();
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const { mutate: updateAvatar } = useMutation<
    IAccount,
    any,
    UpdateAccountRequestBody
  >({
    mutationFn: ({ avatarUrl }) => {
      console.log('avatarUrl', avatarUrl);
      return apiCaller.updateAccount(account.id, { avatarUrl });
    },
    onSuccess: (response) => {
      setIsUploadingImage(false);
      reloadSession();
      queryClient.invalidateQueries(['account']);
      queryClient.setQueryData(['account'], (oldData: IAccount) => {
        return {
          ...oldData,
          avatarUrl: response.avatarUrl,
        };
      });
      enqueueSnackbar('Thay đổi ảnh đại diện thành công', {
        variant: 'success',
      });
    },
    onError: (err) => {
      console.log(err);
      setIsUploadingImage(false);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
  });

  const INITIAL_VALUES = {
    email: account.email || '',
    phone: account.phone || '',
    lastName: account.lastName || '',
    firstName: account.firstName || '',
    birthday: account.birthday || new Date(),
  };

  const handleFormSubmit = async (values: any) => {
    console.log(values);
    updateAccount(values);
  };
  return (
    <Card1>
      <H5 mb={2}>Thông tin cá nhân</H5>
      <FlexBox alignItems='flex-end' mb={3}>
        {isUploadingImage ? (
          <CircularProgress size={40} />
        ) : (
          <Avatar
            src={getAvatarUrl(account)}
            sx={{ height: 64, width: 64, objectFit: 'contain' }}
          />
        )}

        <Box ml={-2.5}>
          <label htmlFor='profile-image'>
            <Button
              onClick={() => {
                if (uploadRef && uploadRef.current) {
                  uploadRef.current.click();
                }
              }}
              component='span'
              color='secondary'
              sx={{
                p: '8px',
                height: 'auto',
                bgcolor: 'grey.300',
                borderRadius: '50%',
              }}
            >
              <CameraEnhance fontSize='small' />
            </Button>
          </label>
        </Box>

        <Box display='none'>
          <IKUpload
            {...IKPublicContext}
            inputRef={uploadRef}
            fileName={account.id}
            useUniqueFileName={false}
            responseFields={['url']}
            folder='/user-avatars'
            validateFile={(file: File) => {
              const isValidAvatar = file.type.startsWith('image/');
              if (!isValidAvatar) {
                enqueueSnackbar('Ảnh đại diện phải là ảnh', {
                  variant: 'error',
                });
                return false;
              }
              return true;
            }}
            onUploadStart={() => {
              setIsUploadingImage(true);
            }}
            onError={(err: any) => {
              console.log(err);
              setIsUploadingImage(false);
              enqueueSnackbar('Đã có lỗi xảy ra khi thay đổi ảnh đại diện', {
                variant: 'error',
              });
            }}
            onSuccess={(response: UploadSuccessResponse) => {
              const newAvatarUrl = `${response.url}?updatedAt=${Date.now()}`;
              updateAvatar({ avatarUrl: newAvatarUrl });
            }}
          />
        </Box>
      </FlexBox>

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
      >
        {({
          resetForm,
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box mb={4}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name='lastName'
                    label='Họ và tên lót'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={(touched.lastName && errors.lastName) as string}
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    name='firstName'
                    label='Tên'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={
                      (touched.firstName && errors.firstName) as string
                    }
                    InputProps={{
                      readOnly: !isEditing,
                    }}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    disabled
                    sx={{
                      '& .Mui-disabled': {
                        color: palette.grey[500],
                        WebkitTextFillColor: palette.grey[500],
                      },
                    }}
                    name='email'
                    type='email'
                    label='Email'
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    error={!!touched.email && !!errors.email}
                    helperText={(touched.email && errors.email) as string}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label='Số điện thoại'
                    name='phone'
                    onBlur={handleBlur}
                    value={values.phone}
                    onChange={handleChange}
                    error={!!touched.phone && !!errors.phone}
                    helperText={(touched.phone && errors.phone) as string}
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
                      disableFuture
                      value={values.birthday}
                      inputFormat='dd/MM/yyyy'
                      renderInput={(props) => (
                        <TextField
                          fullWidth
                          size='small'
                          helperText={
                            (touched.birthday && errors.birthday) as string
                          }
                          error={
                            (!!touched.birthday && !!errors.birthday) ||
                            props.error
                          }
                          {...props}
                        />
                      )}
                      onChange={(newValue) =>
                        setFieldValue('birthday', newValue)
                      }
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>

            <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
              {isEditing ? (
                <Fragment>
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
        )}
      </Formik>
    </Card1>
  );
};

const validationSchema = yup.object().shape({
  lastName: yup.string().required('Vui lòng nhập họ và tên lót'),
  firstName: yup.string().required('Vui lòng nhập tên'),
  email: yup
    .string()
    .email('Định dạng email không hợp lệ')
    .required('Vui lòng nhập email'),
  phone: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        const result = originalValue.replace(/-/g, '');
        return result;
      }
      return value;
    })
    .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
  birthday: yup
    .date()
    .typeError('Vui lòng nhập định dạng ngày sinh hợp lệ')
    .required('Vui lòng nhập ngày sinh'),
});

export default ProfileForm;
