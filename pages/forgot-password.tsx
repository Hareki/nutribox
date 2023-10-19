import { LoadingButton } from '@mui/lab';
import { Box, Card, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useReducer, useState } from 'react';
import * as yup from 'yup';

import mailCaller from 'api-callers/mail';
import SEO from 'components/abstract/SEO';
import { H1, H6 } from 'components/abstract/Typography';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import { getPageLayout } from 'components/layouts/PageLayout';

const initialValues = {
  email: '',
};
type FormValues = typeof initialValues;
const validationSchema = yup.object().shape({});

ResetPassword.getLayout = getPageLayout;

function ResetPassword() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);

  const { mutate: resetPasswordRequest, isLoading } = useMutation<
    undefined,
    unknown,
    string
  >({
    mutationFn: (email) => mailCaller.forgotPassword({ email }),
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
            'Mã xác nhận đã được gửi nếu có tài khoản tương ứng, vui lòng kiểm tra email, bạn sẽ được chuyển về trang chủ sau khi tắt thông báo này',
        },
      });
    },
  });

  const handleFormSubmit = async (values: FormValues) => {
    console.log(values);
    resetPasswordRequest(values.email);
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik<FormValues>({
      initialValues,
      validationSchema,
      onSubmit: handleFormSubmit,
    });

  return (
    <FlexRowCenter flexDirection='column'>
      <SEO title='Khôi phục mật khẩu' />

      <Card sx={{ padding: 4, maxWidth: 600, my: 20, boxShadow: 1 }}>
        <H1 fontSize={20} fontWeight={700} mb={4} textAlign='center'>
          Khôi phục mật khẩu
        </H1>

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
              helperText={touched.email && errors.email}
            />

            <Box sx={{ mt: 2 }}>
              <LoadingButton
                loading={isLoading || isRedirecting}
                fullWidth
                type='submit'
                color='primary'
                variant='contained'
              >
                Gửi mã xác nhận
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
          setIsRedirecting(true);
          router.push('/');
        }}
        title={state.title}
        content={state.content}
      />
    </FlexRowCenter>
  );
}

export default ResetPassword;
