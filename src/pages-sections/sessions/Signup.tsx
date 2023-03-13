import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import * as yup from 'yup';

import EyeToggleButton from './EyeToggleButton';
import { Wrapper } from './Login';

import BazaarImage from 'components/BazaarImage';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import PhoneInput from 'components/PhoneInput';
import { H1, H6 } from 'components/Typography';
import { phoneRegex } from 'helpers/regex.helper';

interface SignupProps {
  handleFormSubmit: (values: any) => void;
  loading: boolean;
}

const Signup: FC<SignupProps> = ({ handleFormSubmit, loading }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <BazaarImage
          src='/assets/images/bazaar-black-sm.svg'
          sx={{ m: 'auto', height: 50 }}
        />

        <H1 textAlign='center' mt={1} mb={4} fontSize={16}>
          Tạo tài khoản
        </H1>

        <FlexBox gap='30px'>
          <BazaarTextField
            mb={1.5}
            fullWidth
            name='lastName'
            size='small'
            label='Họ và tên lót'
            variant='outlined'
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            placeholder='Nguyễn Văn'
            error={!!touched.lastName && !!errors.lastName}
            helperText={(touched.lastName && errors.lastName) as string}
          />
          <BazaarTextField
            mb={1.5}
            fullWidth
            name='firstName'
            size='small'
            label='Tên'
            variant='outlined'
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            placeholder='A'
            error={!!touched.firstName && !!errors.firstName}
            helperText={(touched.firstName && errors.firstName) as string}
          />
        </FlexBox>

        <BazaarTextField
          mb={1.5}
          fullWidth
          name='email'
          size='small'
          type='email'
          variant='outlined'
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label='Email'
          placeholder='exmple@mail.com'
          error={!!touched.email && !!errors.email}
          helperText={(touched.email && errors.email) as string}
        />

        <BazaarTextField
          mb={1.5}
          fullWidth
          name='phone'
          size='small'
          variant='outlined'
          onBlur={handleBlur}
          value={values.phone}
          onChange={handleChange}
          label='Số điện thoại'
          placeholder='000-000-0000'
          error={!!touched.phone && !!errors.phone}
          helperText={(touched.phone && errors.phone) as string}
          InputProps={{
            inputComponent: PhoneInput as any,
          }}
        />

        <BazaarTextField
          mb={1.5}
          fullWidth
          size='small'
          name='password'
          label='Mật khẩu'
          variant='outlined'
          autoComplete='on'
          placeholder='*********'
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.password && !!errors.password}
          helperText={(touched.password && errors.password) as string}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        <BazaarTextField
          mb={3}
          fullWidth
          size='small'
          autoComplete='on'
          name='re_password'
          variant='outlined'
          label='Xác nhận mật khẩu'
          placeholder='*********'
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.re_password}
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.re_password && !!errors.re_password}
          helperText={(touched.re_password && errors.re_password) as string}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        <LoadingButton
          loading={loading}
          loadingPosition='center'
          fullWidth
          name='submit'
          type='submit'
          color='primary'
          variant='contained'
          sx={{ height: 44 }}
        >
          Tạo tài khoản
        </LoadingButton>
      </form>

      {/* <SocialButtons /> */}
      <FlexRowCenter mt='1.25rem'>
        <Box>Đã có tài khoản?</Box>
        <Link href='/login' passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
              Đăng nhập
            </H6>
          </a>
        </Link>
      </FlexRowCenter>
    </Wrapper>
  );
};

const initialValues = {
  firstName: 'asd',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  re_password: '',
};

const formSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('invalid email').required('Email is required'),
  phone: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        return originalValue.replace(/-/g, '');
      }
      return value;
    })
    .matches(phoneRegex, 'Phone number is not valid'),
  password: yup.string().required('Password is required'),
  re_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please re-type password'),
});

export default Signup;
