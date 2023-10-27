import { LoadingButton } from '@mui/lab';
import { Box, Card, TextField } from '@mui/material';
import { Button, Container, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { enqueueSnackbar } from 'notistack';
import { useReducer, useState } from 'react';
import { Fragment } from 'react';

import mailCaller from 'api-callers/mail';
import {
  ResendVerificationEmailDtoSchema,
  type ResendVerificationEmailDto,
} from 'backend/dtos/resendVerificationEmail';
import { AccountService } from 'backend/services/account/account.service';
import SEO from 'components/abstract/SEO';
import { H1, H6 } from 'components/abstract/Typography';
import { Paragraph } from 'components/abstract/Typography';
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
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '2rem',
  padding: '8px 16px',
});

VerificationResult.getLayout = getPageLayout;

const initialValues: ResendVerificationEmailDto = {
  email: '',
};

interface VerificationProps {
  verified: boolean;
}

function VerificationResult({ verified }: VerificationProps) {
  const router = useRouter();
  const [buttonContent, setButtonContent] = useState('Tới trang đăng nhập');
  const [isRedirecting, setRedirecting] = useState(false);
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);
  const { t } = useCustomTranslation(['account']);

  const { mutate: resetPasswordRequest, isLoading } = useMutation<
    undefined,
    unknown,
    string
  >({
    mutationFn: (email) => mailCaller.resendVerificationEmail(email),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
    },
    onSuccess: () => {
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'info',
          title: 'Thông báo',
          content:
            'Đường dẫn xác nhận đã được gửi nếu thông tin email hợp lệ (Đã đăng ký tài khoản với email này và chưa được xác thực). Bạn sẽ được chuyển về trang đăng nhập sau khi tắt thông báo này',
        },
      });
    },
  });

  const handleFormSubmit = async (values: ResendVerificationEmailDto) => {
    console.log(values);
    resetPasswordRequest(values.email);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik<ResendVerificationEmailDto>({
      initialValues,
      validationSchema: toFormikValidationSchema(
        ResendVerificationEmailDtoSchema,
      ),
      onSubmit: handleFormSubmit,
    });

  return (
    <Fragment>
      <SEO title={verified ? 'Xác thực thành công' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        <Wrapper>
          <LazyImage
            width={116}
            height={116}
            alt='complete'
            src={
              verified
                ? '/assets/images/illustrations/party-popper.svg'
                : '/assets/images/logos/shopping-bag.svg'
            }
          />
          <H1 lineHeight={1.1} mt='1.5rem'>
            {verified ? 'Xác thực thành công' : 'Xác thực thất bại'}
          </H1>
          {!verified && (
            <Paragraph mt={1}>
              Đường dẫn không hợp lệ hoặc đã hết hạn, bạn có thể thử gửi lại
              đường dẫn kích hoạt bằng form bên dưới
            </Paragraph>
          )}
          {verified ? (
            <Paragraph color='grey.800' mt='0.3rem'>
              Bạn giờ có thể đăng nhập vào tài khoản đã đăng ký
            </Paragraph>
          ) : (
            <FlexRowCenter flexDirection='column'>
              <SEO title='Khôi phục mật khẩu' />

              <Card sx={{ padding: 4, maxWidth: 600, boxShadow: 0 }}>
                <FlexBox justifyContent='space-between' flexWrap='wrap' my={2}>
                  <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      name='email'
                      type='email'
                      label='Email'
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.email && errors.email)}
                      helperText={t((touched.email && errors.email) as string)}
                    />

                    <Box sx={{ mt: 2 }}>
                      <LoadingButton
                        loading={isLoading || isRedirecting}
                        fullWidth
                        type='submit'
                        color='primary'
                        variant='contained'
                      >
                        Gửi lại mã xác nhận
                      </LoadingButton>
                    </Box>
                  </form>

                  <FlexRowCenter
                    mt='1.25rem'
                    justifyContent='center'
                    width='100%'
                  >
                    <Box>Chưa có tài khoản?</Box>
                    <Link href='/signup' passHref legacyBehavior>
                      <a>
                        <H6
                          ml={1}
                          borderBottom='1px solid'
                          borderColor='grey.900'
                        >
                          Đăng ký
                        </H6>
                      </a>
                    </Link>
                  </FlexRowCenter>
                </FlexBox>
              </Card>
              {/* FIXME could generalize this component and the useReducer into a custom hook */}
              <InfoDialog
                variant={state.variant}
                open={state.open}
                handleClose={() => {
                  dispatch({ type: 'close_dialog' });
                  setRedirecting(true);
                  router.push(SIGN_IN_ROUTE);
                }}
                title={state.title}
                content={state.content}
              />
            </FlexRowCenter>
          )}

          {verified && (
            <FlexBox gap={2} justifyContent='center'>
              <StyledButton
                disabled={isRedirecting}
                onClick={() => {
                  setButtonContent('Đang chuyển hướng...');
                  setRedirecting(true);
                  router.replace(SIGN_IN_ROUTE);
                }}
                color='primary'
                disableElevation
                variant='contained'
                className='button-link'
              >
                {buttonContent}
              </StyledButton>
            </FlexBox>
          )}
        </Wrapper>
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let verified = true;
  const token = context.query.token as string;
  try {
    await AccountService.verifyEmail(token);
  } catch (error) {
    verified = false;
  }

  const locales = await serverSideTranslations(context.locale ?? 'vn', [
    'account',
  ]);

  return {
    props: {
      verified,
      ...locales,
    },
  };
};

export default VerificationResult;
