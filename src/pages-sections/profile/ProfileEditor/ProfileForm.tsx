import { CameraEnhance } from '@mui/icons-material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
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
import { useFormik } from 'formik';
import { IKUpload } from 'imagekitio-react';
import { useSnackbar } from 'notistack';
import { useState, useRef, Fragment, useMemo, useEffect } from 'react';

import profileCaller from 'api-callers/profile';
import type {
  UpdateProfileFormValues,
  UpdateProfileAvatarDto,
} from 'backend/dtos/profile/profile.dto';
import {
  UpdateProfileDtoSchema,
  type UpdateProfileDto,
} from 'backend/dtos/profile/profile.dto';
import { H5 } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import PhoneInput from 'components/common/input/PhoneInput';
import { FlexBox } from 'components/flex-box';
import { IKPublicContext } from 'constants/imagekit.constant';
import { getAvatarUrl } from 'helpers/account.helper';
import { reloadSession } from 'helpers/session.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { CommonCustomerAccountModel } from 'models/account.model';
import type { CustomerModel } from 'models/customer.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';
interface ProfileFormProps {
  account: CommonCustomerAccountModel;
  toggleEditing: () => void;
}

interface UploadSuccessResponse {
  url: string;
}

const ProfileForm = ({ account }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { t } = useCustomTranslation(['customer']);

  const uploadRef = useRef<HTMLInputElement>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { mutate: updateAccount, isLoading } = useMutation<
    CustomerModel,
    any,
    UpdateProfileDto
  >({
    mutationFn: (body) => profileCaller.updateAccount(body),
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
    CustomerModel,
    any,
    UpdateProfileAvatarDto
  >({
    mutationFn: ({ avatarUrl }) => {
      return profileCaller.updateAvatar({ avatarUrl });
    },
    onSuccess: (response) => {
      setIsUploadingImage(false);
      reloadSession();
      queryClient.invalidateQueries(['account']);
      queryClient.setQueryData(['account'], (oldData: CustomerModel) => {
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

  const initialValues: UpdateProfileFormValues = useMemo(
    () => ({
      email: account.customer.email || '',
      phone: account.customer.phone || '',
      lastName: account.customer.lastName || '',
      firstName: account.customer.firstName || '',
      birthday: account.customer.birthday || new Date(),
    }),
    [account],
  );

  const handleFormSubmit = async (values: UpdateProfileFormValues) => {
    delete values.email;
    updateAccount(values);
  };

  const {
    resetForm,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    initialValues,
    validationSchema: toFormikValidationSchema(UpdateProfileDtoSchema),
  });

  return (
    <Card1>
      <H5 mb={2}>Thông tin cá nhân</H5>
      <FlexBox alignItems='flex-end' mb={3}>
        {isUploadingImage ? (
          <CircularProgress size={40} />
        ) : (
          <Avatar
            src={getAvatarUrl(account.customer)}
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
          {/* Should use the UploadFileInput as well, currently don't change because of stability */}
          <IKUpload
            {...IKPublicContext}
            accept='image/*'
            inputRef={uploadRef as any}
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
              setIsUploadingImage(false);
              const newAvatarUrl = `${response.url}?updatedAt=${Date.now()}`;
              updateAvatar({ avatarUrl: newAvatarUrl });
            }}
          />
        </Box>
      </FlexBox>

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
                label='Tên'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                error={!!touched.firstName && !!errors.firstName}
                helperText={t(
                  (touched.firstName && errors.firstName) as string,
                )}
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
                helperText={t((touched.email && errors.email) as string)}
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
                  disableFuture
                  value={values.birthday}
                  inputFormat='dd/MM/yyyy'
                  renderInput={(props) => (
                    <TextField
                      fullWidth
                      size='small'
                      helperText={t(
                        (touched.birthday && errors.birthday) as string,
                      )}
                      error={
                        (!!touched.birthday && !!errors.birthday) || props.error
                      }
                      {...props}
                    />
                  )}
                  onChange={(newValue) => setFieldValue('birthday', newValue)}
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
                Hủy
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
    </Card1>
  );
};

export default ProfileForm;
