import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import * as yup from 'yup';

import EyeToggleButton from './EyeToggleButton';
import { Wrapper } from './Login';

import { H1, H6 } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import MuiImage from 'components/common/input/MuiImage';
import PhoneInput from 'components/common/input/PhoneInput';
import CustomPickersDay from 'components/CustomPickersDay';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { isValidPassword } from 'helpers/password.helper';
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

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema,
  });

  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        <MuiImage
          src='/assets/images/logo-sm.svg'
          sx={{ m: 'auto', height: 50 }}
        />

        <H1 textAlign='center' mt={1} mb={4} fontSize={16}>
          Tạo tài khoản
        </H1>

        <FlexBox gap='30px'>
          <CustomTextField
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
          <CustomTextField
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
          placeholder='exmple@mail.com'
          error={!!touched.email && !!errors.email}
          helperText={(touched.email && errors.email) as string}
        />

        <CustomTextField
          // FIXME should modularize those text fields
          mb={1.5}
          fullWidth
          name='phone'
          size='small'
          variant='outlined'
          onBlur={handleBlur}
          value={values.phone}
          onChange={handleChange}
          label='Số điện thoại'
          placeholder='XXX-XXX-XXXX'
          error={!!touched.phone && !!errors.phone}
          helperText={(touched.phone && errors.phone) as string}
          InputProps={{
            inputComponent: PhoneInput as any,
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label='Ngày sinh'
            maxDate={new Date()}
            value={values.birthday}
            inputFormat='dd/MM/yyyy'
            renderInput={(props) => (
              <CustomTextField
                mb={1.5}
                fullWidth
                name='birthday'
                size='small'
                helperText={(touched.birthday && errors.birthday) as string}
                error={!!touched.birthday && !!errors.birthday}
                {...(props as any)}
              />
            )}
            onChange={(newValue) => {
              setFieldValue('birthday', newValue);
            }}
            renderDay={(_, __, pickersDayProps) => (
              <CustomPickersDay {...pickersDayProps} selected_color='white' />
            )}
          />
        </LocalizationProvider>

        <CustomTextField
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

        <CustomTextField
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
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: new Date(),
  password: '',
  re_password: '',
};

const formSchema = yup.object().shape({
  firstName: yup.string().required('Vui lòng nhập tên'),
  lastName: yup.string().required('Vui lòng nhập họ'),
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
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .test(
      'isValidPassword',
      'Mật khẩu phải chứa ít nhất 10 ký tự, chứa ít nhất 1 ký tự đặc biệt và số',
      (value) => isValidPassword(value),
    ),
  re_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Xác nhận mật khẩu không khớp')
    .required('Vui lòng nhập xác nhận mật khẩu'),
});

export default Signup;
