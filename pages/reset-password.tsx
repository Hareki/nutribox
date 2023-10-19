import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, TextField, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useCallback, useReducer, useState } from 'react';
import { MoreThan } from 'typeorm';

import mailCaller from 'api-callers/mail';
import type { ResetPasswordFormValues } from 'backend/dtos/password/resetPassword.dto';
import { AccountEntity } from 'backend/entities/account.entity';
import { CommonService } from 'backend/services/common/common.service';
import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { getPageLayout } from 'components/layouts/PageLayout';
import LazyImage from 'components/LazyImage';
import { SIGN_IN_ROUTE } from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import {
  PasswordConfirmationSchema,
  type FullyPopulatedAccountModel,
} from 'models/account.model';
import EyeToggleButton from 'pages-sections/auth/EyeToggleButton';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

ChangePassword.getLayout = getPageLayout;

const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

interface ChangePasswordProps {
  isValidToken: boolean;
  token: string;
}

const initialValues: ResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

function ChangePassword({ isValidToken, token }: ChangePasswordProps) {
  const router = useRouter();
  const [buttonContent, setButtonContent] = useState('Khôi phục');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);
  const { t } = useCustomTranslation(['account']);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const { mutate: resetPassword, isLoading } = useMutation<
    FullyPopulatedAccountModel,
    unknown,
    string
  >({
    mutationFn: (password) =>
      mailCaller.resetPassword({
        password,
        forgotPasswordToken: token,
      }),
    onSuccess: () => {
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'info',
          title: 'Thông báo',
          content:
            'Khôi phục mật khẩu thành công, bạn sẽ được chuyển đến trang đăng nhập sau khi tắt thông báo này',
        },
      });
    },
    onError: (error) => {
      console.log(error);
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title: 'Thông báo',
          content: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        },
      });
    },
  });

  const handleFormSubmit = async (values: ResetPasswordFormValues) => {
    console.log(values);
    console.log(token);
    setButtonContent('Đang khôi phục...');
    resetPassword(values.password);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik<ResetPasswordFormValues>({
      initialValues,
      validationSchema: toFormikValidationSchema(PasswordConfirmationSchema),
      onSubmit: handleFormSubmit,
    });

  return (
    <Fragment>
      <FlexRowCenter flexDirection='column' my={20}>
        <SEO title='Khôi phục mật khẩu' />

        {isValidToken ? (
          <Card sx={{ padding: 4, maxWidth: 600, boxShadow: 1 }}>
            <H1 fontSize={20} fontWeight={700} mb={3} textAlign='center'>
              Khôi phục mật khẩu
            </H1>

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
                  label='Mật khẩu mới'
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
                  label='Xác nhận mật khẩu mới'
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
                    loading={isLoading || isRedirecting}
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

            <InfoDialog
              variant={state.variant}
              open={state.open}
              handleClose={() => {
                dispatch({ type: 'close_dialog' });
                setIsRedirecting(true);
                router.push(SIGN_IN_ROUTE);
              }}
              title={state.title}
              content={state.content}
            />
          </Card>
        ) : (
          <Container>
            <Wrapper>
              <LazyImage
                width={116}
                height={116}
                alt='complete'
                src='/assets/images/logos/shopping-bag.svg'
              />
              <H1 lineHeight={1.1} mt='1.5rem'>
                Xác thực thất bại
              </H1>

              <Paragraph color='grey.800' mt='0.3rem'>
                Đường dẫn đã hết hạn hoặc không tồn tại
              </Paragraph>
            </Wrapper>
          </Container>
        )}
      </FlexRowCenter>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.query.token as string;
  let isValidToken = true;
  try {
    await CommonService.getRecord({
      entity: AccountEntity,
      filter: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: MoreThan(new Date()),
      },
      relations: ['customer', 'employee'],
    });
  } catch (error) {
    isValidToken = false;
  }

  const locales = await serverSideTranslations(context.locale ?? 'vn', [
    'account',
  ]);

  return {
    props: {
      isValidToken,
      token: token || '',
      ...locales,
    },
  };
};

export default ChangePassword;
