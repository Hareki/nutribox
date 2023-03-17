// TODO: Đây là trang dùng để edit profile
import { CameraEnhance, Person } from '@mui/icons-material';
import { Avatar, Box, Button, Grid, TextField, useTheme } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Formik } from 'formik';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import type { IAccount } from 'api/models/Account.model/types';
import Card1 from 'components/common/Card1';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import { FlexBox } from 'components/flex-box';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { phoneRegex } from 'helpers/regex.helper';

type Props = { account: IAccount; toggleEditing: () => void };

const ProfileEditor: NextPage<Props> = ({ account, toggleEditing }) => {
  const router = useRouter();
  const { palette } = useTheme();

  const INITIAL_VALUES = {
    email: account.email || '',
    phone: account.phone || '',
    last_name: account.lastName || '',
    first_name: account.firstName || '',
    birthday: account.birthday || new Date(),
  };

  const checkoutSchema = yup.object().shape({
    last_name: yup.string().required('Vui lòng nhập họ và tên lót'),
    first_name: yup.string().required('Vui lòng nhập tên'),
    email: yup
      .string()
      .email('Định dạng email không hợp lệ')
      .required('Vui lòng nhập email'),
    phone: yup
      .string()
      .transform((value, originalValue) => {
        if (originalValue && typeof originalValue === 'string') {
          return originalValue.replace(/-/g, '');
        }
        return value;
      })
      .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
    birthday: yup
      .date()
      .typeError('Vui lòng nhập định dạng ngày sinh hợp lệ')
      .required('Vui lòng nhập ngày sinh'),
  });

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  // SECTION TITLE HEADER LINK
  const HEADER_LINK = (
    <Button
      color='primary'
      sx={{ px: 4, bgcolor: 'primary.light' }}
      onClick={() => toggleEditing()}
    >
      Huỷ bỏ
    </Button>
  );

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={Person}
        title='Sửa thông tin'
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* PROFILE EDITOR FORM */}
      <Card1>
        <FlexBox alignItems='flex-end' mb={3}>
          <Avatar src={account.avatarUrl} sx={{ height: 64, width: 64 }} />

          <Box ml={-2.5}>
            <label htmlFor='profile-image'>
              <Button
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
            <input
              onChange={(e) => console.log(e.target.files)}
              id='profile-image'
              accept='image/*'
              type='file'
            />
          </Box>
        </FlexBox>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={INITIAL_VALUES}
          validationSchema={checkoutSchema}
        >
          {({
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
                      name='last_name'
                      label='Họ và tên lót'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.last_name}
                      error={!!touched.last_name && !!errors.last_name}
                      helperText={
                        (touched.last_name && errors.last_name) as string
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name='first_name'
                      label='Tên'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.first_name}
                      error={!!touched.first_name && !!errors.first_name}
                      helperText={
                        (touched.first_name && errors.first_name) as string
                      }
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      disabled
                      sx={{
                        '& .Mui-disabled': {
                          color: palette.grey[500],
                          '-webkit-text-fill-color': palette.grey[500],
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
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Box>

              <Button type='submit' variant='contained' color='primary'>
                Lưu thay đổi
              </Button>
            </form>
          )}
        </Formik>
      </Card1>
    </CustomerDashboardLayout>
  );
};

export default ProfileEditor;
