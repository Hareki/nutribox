import { LoadingButton } from '@mui/lab';
import { Box, Card, TextField, Button, styled } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { useReducer, type FC, useState } from 'react';

import { H1, H6, Paragraph } from './abstract/Typography';
import BazaarCard from './common/BazaarCard';
import InfoDialog from './dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from './dialog/info-dialog/reducer';
import { FlexBox, FlexRowCenter } from './flex-box';
import LazyImage from './LazyImage';

import mailCaller from 'api-callers/mail';
import type { ResendVerificationEmailDto } from 'backend/dtos/resendVerificationEmail';
import { ResendVerificationEmailDtoSchema } from 'backend/dtos/resendVerificationEmail';
import {
  SIGN_IN_ROUTE,
  SIGN_IN_STAFF_ROUTE,
} from 'constants/routes.ui.constant';
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

const initialValues: ResendVerificationEmailDto = {
  email: '',
};

type VerificationResultProps = {
  verified: boolean;
  isEmployee: boolean;
};

const VerificationResultComp: FC<VerificationResultProps> = ({
  verified,
  isEmployee,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [buttonContent, setButtonContent] = useState('Tới trang đăng nhập');
  const [isRedirecting, setRedirecting] = useState(false);
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);
  const { t } = useCustomTranslation(['account']);

  const { mutate: resendVerificationEmail, isLoading } = useMutation<
    undefined,
    unknown,
    string
  >({
    mutationFn: (email) => mailCaller.resendVerificationEmail(email),
    onError: (error) => {
      console.log(error);
      enqueueSnackbar(t('Internet.Error'), {
        variant: 'error',
      });
    },
    onSuccess: () => {
      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'info',
          title: 'Thông báo',
          content: t('Account.ResendVerification.Success'),
        },
      });
    },
  });

  const handleFormSubmit = async (values: ResendVerificationEmailDto) => {
    console.log(values);
    resendVerificationEmail(values.email);
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
          Đường dẫn không hợp lệ hoặc đã hết hạn, bạn có thể thử gửi lại đường
          dẫn kích hoạt bằng form bên dưới
        </Paragraph>
      )}
      {verified ? (
        <Paragraph color='grey.800' mt='0.3rem'>
          Bạn giờ có thể đăng nhập vào tài khoản đã đăng ký
        </Paragraph>
      ) : (
        <FlexRowCenter flexDirection='column'>
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

              <FlexRowCenter mt='1.25rem' justifyContent='center' width='100%'>
                <Box>Chưa có tài khoản?</Box>
                <Link href='/signup' passHref legacyBehavior>
                  <a>
                    <H6 ml={1} borderBottom='1px solid' borderColor='grey.900'>
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
              router.push(isEmployee ? SIGN_IN_STAFF_ROUTE : SIGN_IN_ROUTE);
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
  );
};

export default VerificationResultComp;
