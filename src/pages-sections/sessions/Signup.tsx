import { Button, Box } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';
import * as yup from 'yup';

import EyeToggleButton from './EyeToggleButton';
import { Wrapper } from './Login';
import SocialButtons from './SocialButtons';

import BazaarImage from 'components/BazaarImage';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { H1, H6 } from 'components/Typography';

const Signup: FC = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

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
          Create Your Account
        </H1>

        <FlexBox gap='30px'>
          <BazaarTextField
            mb={1.5}
            fullWidth
            name='name'
            size='small'
            label='Họ và tên lót'
            variant='outlined'
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            placeholder='Ralph Adwards'
            error={!!touched.name && !!errors.name}
            helperText={(touched.name && errors.name) as string}
          />
          <BazaarTextField
            mb={1.5}
            fullWidth
            name='name'
            size='small'
            label='Tên'
            variant='outlined'
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            placeholder='Ralph Adwards'
            error={!!touched.name && !!errors.name}
            helperText={(touched.name && errors.name) as string}
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
          name='email'
          size='small'
          type='email'
          variant='outlined'
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label='Số điện thoại'
          placeholder='0338758008'
          error={!!touched.email && !!errors.email}
          helperText={(touched.email && errors.email) as string}
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

        <Button
          fullWidth
          type='submit'
          color='primary'
          variant='contained'
          sx={{ height: 44 }}
        >
          Tạo tài khoản
        </Button>
      </form>

      <SocialButtons />
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
  name: '',
  email: '',
  password: '',
  re_password: '',
  agreement: false,
};

const formSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  re_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please re-type password'),
  agreement: yup
    .bool()
    .test(
      'agreement',
      'You have to agree with our Terms and Conditions!',
      (value) => value === true,
    )
    .required('You have to agree with our Terms and Conditions!'),
});

export default Signup;
