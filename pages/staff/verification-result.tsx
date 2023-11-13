import { LoadingButton } from '@mui/lab';
import { Box, styled, TextField } from '@mui/material';
import { Container } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCallback, useReducer, useState } from 'react';
import { Fragment } from 'react';

import mailCaller from 'api-callers/mail';
import type { ResetPasswordFormValues } from 'backend/dtos/password/resetPassword.dto';
import { AccountService } from 'backend/services/account/account.service';
import SEO from 'components/abstract/SEO';
import BazaarCard from 'components/common/BazaarCard';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexBox } from 'components/flex-box';
import { getPageLayout } from 'components/layouts/PageLayout';
import VerificationResultComp from 'components/VerificationResultComp';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { FullyPopulatedAccountModel } from 'models/account.model';
import { PasswordConfirmationSchema } from 'models/account.model';
import EyeToggleButton from 'pages-sections/auth/EyeToggleButton';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

VerificationResult.getLayout = getPageLayout;

const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const initialValues: ResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

interface VerificationProps {
  isValidToken: boolean;
}

function VerificationResult({ isValidToken }: VerificationProps) {
  const router = useRouter();
  const token = router.query.token as string;
  const [buttonContent, setButtonContent] = useState('Kích hoạt tài khoản');
  const [verified, setVerified] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);
  const { t } = useCustomTranslation(['account']);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const { mutate: verifyEmployeeEmail, isLoading } = useMutation<
    FullyPopulatedAccountModel,
    unknown,
    string
  >({
    mutationFn: (password) =>
      mailCaller.verifyEmployeeEmail({
        password,
        verificationToken: token,
      }),
    onSuccess: () => {
      setVerified(true);
    },
    onError: (error) => {
      console.log(error);
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title: 'Thông báo',
          content: t('Internet.Error'),
        },
      });
    },
  });

  const handleFormSubmit = async (values: ResetPasswordFormValues) => {
    console.log(values);
    console.log(token);
    setButtonContent('Đang xác thực tài khoản...');
    verifyEmployeeEmail(values.password);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik<ResetPasswordFormValues>({
      initialValues,
      validationSchema: toFormikValidationSchema(PasswordConfirmationSchema),
      onSubmit: handleFormSubmit,
    });

  return (
    <Fragment>
      <SEO title={isValidToken ? 'Xác thực tài khoản' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        {isValidToken ? (
          !verified ? (
            <Wrapper>
              <FlexBox justifyContent='space-between' flexWrap='wrap'>
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    sx={{
                      mb: 3,
                    }}
                    name='password'
                    size='medium'
                    type={passwordVisibility ? 'text' : 'password'}
                    label='Mật khẩu'
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange}
                    error={Boolean(touched.password && errors.password)}
                    helperText={t(
                      (touched.password && errors.password) as string,
                    )}
                    InputProps={{
                      endAdornment: (
                        <EyeToggleButton
                          show={passwordVisibility}
                          click={togglePasswordVisibility}
                        />
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    sx={{
                      mb: 3,
                    }}
                    size='medium'
                    name='confirmPassword'
                    type={passwordVisibility ? 'text' : 'password'}
                    label='Xác nhận mật khẩu'
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    error={Boolean(
                      touched.confirmPassword && errors.confirmPassword,
                    )}
                    helperText={t(
                      (touched.confirmPassword &&
                        errors.confirmPassword) as string,
                    )}
                    InputProps={{
                      endAdornment: (
                        <EyeToggleButton
                          show={passwordVisibility}
                          click={togglePasswordVisibility}
                        />
                      ),
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <LoadingButton
                      loading={isLoading}
                      fullWidth
                      type='submit'
                      color='primary'
                      variant='contained'
                    >
                      {buttonContent}
                    </LoadingButton>
                  </Box>
                </form>
              </FlexBox>
            </Wrapper>
          ) : (
            <VerificationResultComp verified isEmployee />
          )
        ) : (
          <VerificationResultComp verified={false} isEmployee />
        )}
      </Container>
      <InfoDialog
        variant={state.variant}
        open={state.open}
        handleClose={() => {
          dispatch({ type: 'close_dialog' });
        }}
        title={state.title}
        content={state.content}
      />
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let isValidToken = true;
  const token = context.query.token as string;
  try {
    isValidToken = await AccountService.checkVerificationToken(token);
  } catch (error) {
    isValidToken = false;
  }

  const locales = await serverSideTranslations(context.locale ?? 'vn', [
    'account',
    'common',
  ]);

  return {
    props: {
      isValidToken,
      ...locales,
    },
  };
};

export default VerificationResult;
