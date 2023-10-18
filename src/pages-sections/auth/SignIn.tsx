import { LoadingButton } from '@mui/lab';
import type { CardProps } from '@mui/material';
import { Card, Box, styled } from '@mui/material';
import { useFormik } from 'formik';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import EyeToggleButton from './EyeToggleButton';

import type { SignInDto } from 'backend/dtos/signIn.dto';
import { SignInDtoSchema } from 'backend/dtos/signIn.dto';
import { H1, H4, H6 } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import MuiImage from 'components/common/input/MuiImage';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import {
  FORGOT_PASSWORD_ROUTE,
  SIGN_UP_ROUTE,
} from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const fbStyle = { background: '#3B5998', color: 'white' };
const googleStyle = { background: '#4285F4', color: 'white' };

type WrapperProps = { passwordVisibility?: boolean };

export const Wrapper = styled<FC<WrapperProps & CardProps>>(
  ({ children, passwordVisibility, ...rest }) => (
    <Card {...rest}>{children}</Card>
  ),
)<CardProps>(({ theme, passwordVisibility }) => ({
  width: 600,
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

interface SignInProps {
  handleFormSubmit: (values: any) => void;
  loading: boolean;
  errorMessage: string;
}

const SignIn: FC<SignInProps> = ({
  handleFormSubmit,
  loading = false,
  errorMessage,
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { t } = useCustomTranslation(['account']);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik<SignInDto>({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: toFormikValidationSchema(SignInDtoSchema),
    });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <MuiImage
          src='/assets/images/logo-sm.svg'
          sx={{ m: 'auto', height: 50 }}
        />

        <H1 textAlign='center' mt={1} mb={4} fontSize={16}>
          Chào mừng đến với Nutribox
        </H1>

        <CustomTextField
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
          placeholder='example@gmail.com'
          error={!!touched.email && !!errors.email}
          helperText={t((touched.email && errors.email) as string)}
        />

        <CustomTextField
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
          placeholder='*********'
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.password && !!errors.password}
          helperText={t((touched.password && errors.password) as string)}
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
          Đăng nhập
        </LoadingButton>
      </form>

      {!!errorMessage && (
        <H4 mt={2} mb={4} textAlign='center' color='error.500'>
          {t('Account.Credentials.Invalid')}
        </H4>
      )}

      {/* <SocialButtons /> */}

      <FlexRowCenter mt='1.25rem'>
        <Box>Chưa có tài khoản?</Box>
        <Link href={SIGN_UP_ROUTE} passHref legacyBehavior>
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
        <Link href={FORGOT_PASSWORD_ROUTE} passHref legacyBehavior>
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

// const formSchema = yup.object().shape({
//   email: yup
//     .string()
//     .email('Vui lòng nhập email hợp lệ')
//     .required('Vui lòng nhập email'),
//   password: yup.string().required('Vui lòng nhập mật khẩu'),
// });

// const formSchema = yup.object().shape({
//   password: yup.string().required('Vui lòng nhập mật khẩu'),
//   emailOrPhone: yup
//     .mixed()
//     .test(
//       'emailOrPhone',
//       'Vui lòng nhập email hoặc số điện thoại',
//       function (value) {
//         const { path, createError } = this;

//         if (!value) {
//           return createError({
//             path,
//             message: 'Vui lòng nhập email hoặc số điện thoại',
//           });
//         }

//         if (yup.string().email().isValidSync(value)) {
//           return true;
//         }

//         if (phoneRegex.test(value)) {
//           return true;
//         }

//         return createError({
//           path,
//           message: 'Vui lòng nhập email hoặc số điện thoại hợp lệ',
//         });
//       },
//     )
//     .required('Vui lòng nhập email hoặc số điện thoại'),
// });

export default SignIn;
