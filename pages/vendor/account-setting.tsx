import { CameraAlt } from '@mui/icons-material';
import { Avatar, Badge, Box, Button, Card, Grid, SxProps } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import { FC, Fragment, ReactElement } from 'react';
import * as yup from 'yup';

import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { H3 } from 'components/Typography';
import countryList from 'data/countryList';

// upload button
type UploadButtonProps = { id: string; style?: SxProps };
const UploadButton: FC<UploadButtonProps> = ({ id, style = {} }) => {
  return (
    <Fragment>
      <label htmlFor={id}>
        <Button
          size='small'
          component='span'
          color='secondary'
          sx={{
            p: '6px',
            height: 'auto',
            borderRadius: '50%',
            bgcolor: 'info.100',
            ...style,
            ':hover': { backgroundColor: 'grey.300' },
          }}
        >
          <CameraAlt fontSize='small' color='info' />
        </Button>
      </label>

      <input
        id={id}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => console.log(e.target.files)}
        style={{ display: 'none' }}
      />
    </Fragment>
  );
};

const accountSchema = yup.object().shape({
  city: yup.string().required('City is required'),
  country: yup.mixed().required('Country is required'),
  contact: yup.string().required('Contact is required'),
  last_name: yup.string().required('Last name is required'),
  first_name: yup.string().required('First name is required'),
  email: yup.string().email('Invalid Email').required('Email is required'),
});

// =============================================================================
AccountSetting.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function AccountSetting() {
  const INITIAL_VALUES = {
    city: '',
    email: '',
    contact: '',
    country: null,
    last_name: '',
    first_name: '',
  };

  const handleFormSubmit = async (values: any) => {
    console.log(values.city);
  };

  return (
    <Box py={4}>
      <H3 mb={2}>Account Setting</H3>

      <Card sx={{ p: 4 }}>
        <Box
          mb={3}
          height='173px'
          overflow='hidden'
          borderRadius='10px'
          position='relative'
          style={{
            background:
              'url(/assets/images/banners/banner-10.png) center/cover',
          }}
        >
          <Box position='absolute' bottom={20} left={24}>
            <Badge
              overlap='circular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <UploadButton
                  id='profile-image'
                  style={{ bgcolor: 'grey.300' }}
                />
              }
            >
              <Avatar
                src='/assets/images/faces/propic(9).png'
                sx={{
                  width: 80,
                  height: 80,
                  border: '4px solid',
                  borderColor: 'grey.100',
                }}
              />
            </Badge>
          </Box>

          <Box position='absolute' top={20} right={20}>
            <UploadButton id='cover-image' />
          </Box>
        </Box>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={INITIAL_VALUES}
          validationSchema={accountSchema}
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
                      color='info'
                      size='medium'
                      name='first_name'
                      label='First Name'
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
                      color='info'
                      size='medium'
                      name='last_name'
                      label='Last Name'
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
                      color='info'
                      name='email'
                      type='email'
                      label='Email'
                      size='medium'
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
                      type='tel'
                      color='info'
                      size='medium'
                      name='contact'
                      label='Phone'
                      onBlur={handleBlur}
                      value={values.contact}
                      onChange={handleChange}
                      error={!!touched.contact && !!errors.contact}
                      helperText={(touched.contact && errors.contact) as string}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      options={countryList}
                      value={values.country}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, value) => setFieldValue('country', value)}
                      renderInput={(params) => (
                        <TextField
                          color='info'
                          label='Country'
                          variant='outlined'
                          placeholder='Select Country'
                          error={!!touched.country && !!errors.country}
                          helperText={
                            (touched.country && errors.country) as string
                          }
                          {...params}
                          size='medium'
                        />
                      )}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      name='city'
                      label='City'
                      color='info'
                      size='medium'
                      onBlur={handleBlur}
                      value={values.city}
                      onChange={handleChange}
                      error={!!touched.city && !!errors.city}
                      helperText={(touched.city && errors.city) as string}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button type='submit' variant='contained' color='info'>
                Save Changes
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
}
