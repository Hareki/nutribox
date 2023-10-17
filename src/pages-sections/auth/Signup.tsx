import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EyeToggleButton from './EyeToggleButton';
import { Wrapper } from './SignIn';

import type { SignUpFormValues } from 'backend/dtos/signUp.dto';
import { SignUpFormSchema } from 'backend/dtos/signUp.dto';
import { H1, H6 } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import MuiImage from 'components/common/input/MuiImage';
import PhoneInput from 'components/common/input/PhoneInput';
import CustomPickersDay from 'components/CustomPickersDay';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

interface SignUpProps {
  handleFormSubmit: (values: any) => void;
  loading: boolean;
  disabled: boolean;
}
const initialValues: SignUpFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: new Date(),
  password: '',
  confirmPassword: '',
};

const SignUp: FC<SignUpProps> = ({ handleFormSubmit, loading, disabled }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { t: tc } = useTranslation('customer');
  const { t: ta } = useTranslation('account');

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
  } = useFormik<SignUpFormValues>({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: toFormikValidationSchema(SignUpFormSchema),
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

        <FlexBox
          gap='30px'
          sx={{
            '& > *': {
              flex: 1,
            },
          }}
        >
          <CustomTextField
            mb={1.5}
            fullWidth
            name='lastName'
            size='small'
            label='Họ và tên lót'
            variant='outlined'
            onBlur={handleBlur}
            value={values.lastName}
            onChange={handleChange}
            placeholder='Nguyễn Văn'
            error={!!touched.lastName && !!errors.lastName}
            helperText={
              (touched.lastName && tc(errors.lastName || '')) as string
            }
          />
          <CustomTextField
            mb={1.5}
            fullWidth
            name='firstName'
            size='small'
            label='Tên'
            variant='outlined'
            onBlur={handleBlur}
            value={values.firstName}
            onChange={handleChange}
            placeholder='A'
            error={!!touched.firstName && !!errors.firstName}
            helperText={
              (touched.firstName && tc(errors.firstName || '')) as string
            }
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
          helperText={(touched.email && ta(errors.email || '')) as string}
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
          helperText={(touched.phone && tc(errors.phone || '')) as string}
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
                helperText={
                  (touched.birthday && tc(errors.birthday as string)) as string
                }
                error={!!touched.birthday && !!errors.birthday}
                {...(props as any)}
              />
            )}
            onChange={(newValue) => {
              setFieldValue('birthday', newValue);
            }}
            renderDay={(_, __, pickersDayProps) => (
              <CustomPickersDay
                {...(pickersDayProps as any)}
                selected_color='white'
              />
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
          helperText={(touched.password && ta(errors.password || '')) as string}
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
          name='confirmPassword'
          variant='outlined'
          label='Xác nhận mật khẩu'
          placeholder='*********'
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.confirmPassword}
          type={passwordVisibility ? 'text' : 'password'}
          error={!!touched.confirmPassword && !!errors.confirmPassword}
          helperText={
            (touched.confirmPassword &&
              ta(errors.confirmPassword || '')) as string
          }
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
          disabled={disabled}
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

export default SignUp;
