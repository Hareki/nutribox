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
import { useState, useRef, Fragment, useMemo } from 'react';

import staffProfileCaller from 'api-callers/staff/profile';
import type { UpdateProfileAvatarDto } from 'backend/dtos/profile/profile.dto';
import { type UpdateProfileDto } from 'backend/dtos/profile/profile.dto';
import {
  UpdateStaffProfileDtoSchema,
  type UpdateStaffProfileFormValues,
} from 'backend/dtos/staffProfile/updateStaffProfile.dto';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import { H5 } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import PhoneInput from 'components/common/input/PhoneInput';
import { FlexBox } from 'components/flex-box';
import { IKPublicContext } from 'constants/imagekit.constant';
import { getAvatarUrl } from 'helpers/account.helper';
import { reloadSession } from 'helpers/session.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { CommonEmployeeAccountModel } from 'models/account.model';
import { mergeTime } from 'utils/date.helper';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';
interface Props {
  account: CommonEmployeeAccountModel;
}

interface UploadSuccessResponse {
  url: string;
}

const EmployeeProfileForm = ({ account }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { t } = useCustomTranslation(['employee']);

  const uploadRef = useRef<HTMLInputElement>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { mutate: updateAccount, isLoading } = useMutation<
    CommonEmployeeModel,
    any,
    UpdateProfileDto
  >({
    mutationFn: (body) => staffProfileCaller.updateAccount(body),
    onSuccess: () => {
      reloadSession();
      enqueueSnackbar(t('Employee.UpdateProfile.Success'), {
        variant: 'success',
      });
      queryClient.invalidateQueries(['staff', 'profile']);
      setIsEditing(false);
      //   toggleEditing();
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(t('Internet.Error'), {
        variant: 'error',
      });
    },
  });

  const { mutate: updateAvatar } = useMutation<
    CommonEmployeeModel,
    any,
    UpdateProfileAvatarDto
  >({
    mutationFn: ({ avatarUrl }) => {
      return staffProfileCaller.updateAvatar({ avatarUrl });
    },
    onSuccess: (response) => {
      setIsUploadingImage(false);
      reloadSession();
      queryClient.invalidateQueries(['staff', 'profile']);
      queryClient.setQueryData(
        ['staff', 'profile'],
        (oldData: CommonEmployeeModel) => {
          return {
            ...oldData,
            avatarUrl: response.avatarUrl,
          };
        },
      );
      enqueueSnackbar(t('Employee.UpdateProfilePicture.Success'), {
        variant: 'success',
      });
    },
    onError: (err) => {
      console.log(err);
      setIsUploadingImage(false);
      enqueueSnackbar(t('Internet.Error'), {
        variant: 'error',
      });
    },
  });

  const initialValues: UpdateStaffProfileFormValues = useMemo(
    () => ({
      email: account.employee.email || '',
      phone: account.employee.phone || '',
      lastName: account.employee.lastName || '',
      firstName: account.employee.firstName || '',
      birthday: account.employee.birthday || new Date(),
      personalId: account.employee.personalId || '',
    }),
    [account],
  );

  const handleFormSubmit = async (values: UpdateStaffProfileFormValues) => {
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
    validationSchema: toFormikValidationSchema(UpdateStaffProfileDtoSchema),
  });

  return (
    <Card1>
      <H5 mb={2}>Thông tin cá nhân</H5>
      <FlexBox alignItems='flex-end' mb={3}>
        {isUploadingImage ? (
          <CircularProgress size={40} />
        ) : (
          <Avatar
            src={getAvatarUrl(account.employee)}
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
                enqueueSnackbar(t('Employee.ProfilePicture.InvalidFormat'), {
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
              enqueueSnackbar(t('Employee.ProfilePicture.Failed'), {
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
                disabled
                sx={{
                  '& .Mui-disabled': {
                    color: palette.grey[500],
                    WebkitTextFillColor: palette.grey[500],
                  },
                }}
                name='email'
                type='email'
                label='Số CCCD'
                onBlur={handleBlur}
                value={values.personalId}
                onChange={handleChange}
                error={!!touched.personalId && !!errors.personalId}
                helperText={t(
                  (touched.personalId && errors.personalId) as string,
                )}
              />
            </Grid>

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
                  readOnly={!isEditing}
                  value={values.birthday}
                  inputFormat='dd/MM/yyyy'
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      fullWidth
                      size='small'
                      helperText={t(
                        (touched.birthday && errors.birthday) as string,
                      )}
                      error={
                        (!!touched.birthday && !!errors.birthday) || props.error
                      }
                    />
                  )}
                  onChange={(newValue) =>
                    setFieldValue(
                      'birthday',
                      mergeTime(newValue || new Date(), new Date()),
                    )
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

export default EmployeeProfileForm;
