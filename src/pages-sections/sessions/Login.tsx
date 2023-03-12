import { Button, Card, CardProps, Box, styled } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useCallback, useState, FC } from 'react';
import * as yup from 'yup';

import EyeToggleButton from './EyeToggleButton';
import SocialButtons from './SocialButtons';

import BazaarImage from 'components/BazaarImage';
import BazaarTextField from 'components/BazaarTextField';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { H1, H6 } from 'components/Typography';
import { phoneRegex } from 'helpers/regex.helper';

const fbStyle = { background: '#3B5998', color: 'white' };
const googleStyle = { background: '#4285F4', color: 'white' };

type WrapperProps = { passwordVisibility?: boolean };

export const Wrapper = styled<FC<WrapperProps & CardProps>>(
  ({ children, passwordVisibility, ...rest }) => (
    <Card {...rest}>{children}</Card>
  ),
)<CardProps>(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: '2rem 3rem',
  [theme.breakpoints.down('sm')]: { width: '100%' },
  '.passwordEye': {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  '.facebookButton': { marginBottom: 10, ...fbStyle, '&:hover': fbStyle },
  '.googleButton': { ...googleStyle, '&:hover': googleStyle },
  '.agreement': { marginTop: 12, marginBottom: 24 },
}));

const Login = () => {
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
          Chào mừng đến với Nutribox
        </H1>

        <BazaarTextField
          mb={1.5}
          fullWidth
          name='emailOrPhone'
          size='small'
          type='email'
          variant='outlined'
          onBlur={handleBlur}
          value={values.emailOrPhone}
          onChange={handleChange}
          label='Email hoặc số điện thoại'
          // placeholder='Email/Số điện thoại'
          error={!!touched.emailOrPhone && !!errors.emailOrPhone}
          helperText={(touched.emailOrPhone && errors.emailOrPhone) as string}
        />

        <BazaarTextField
          mb={2}
          fullWidth
          size='small'
          name='password'
          label='Mật khẩu'
          autoComplete='on'
          variant='outlined'
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          // placeholder='*********'
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

        <Button
          fullWidth
          type='submit'
          color='primary'
          variant='contained'
          sx={{ height: 44 }}
        >
          Đăng nhập
        </Button>
      </form>

      <SocialButtons />

      <FlexRowCenter mt='1.25rem'>
        <Box>Chưa có tài khoản?</Box>
        <Link href='/signup' passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
              Đăng ký
            </H6>
          </a>
        </Link>
      </FlexRowCenter>

      <FlexBox
        justifyContent='center'
        bgcolor='grey.200'
        borderRadius='4px'
        py={2.5}
        mt='1.25rem'
      >
        Quên mật khẩu?
        <Link href='/reset-password' passHref legacyBehavior>
          <a>
            <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
              Khôi phục
            </H6>
          </a>
        </Link>
      </FlexBox>
    </Wrapper>
  );
};

const initialValues = {
  email: '',
  password: '',
};

const formSchema = yup.object().shape({
  password: yup.string().required('Vui lòng nhập mật khẩu'),
  emailOrPhone: yup
    .mixed()
    .test(
      'emailOrPhone',
      'Vui lòng nhập email hoặc số điện thoại',
      function (value) {
        const { path, createError } = this;

        if (!value) {
          return createError({
            path,
            message: 'Vui lòng nhập email hoặc số điện thoại',
          });
        }

        if (yup.string().email().isValidSync(value)) {
          return true;
        }

        if (phoneRegex.test(value)) {
          return true;
        }

        return createError({
          path,
          message: 'Vui lòng nhập email hoặc số điện thoại hợp lệ',
        });
      },
    )
    .required('Vui lòng nhập email hoặc số điện thoại'),
});

export default Login;
