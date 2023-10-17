import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReducer, useState } from 'react';

import signUpCaller from 'api-callers/sign-up';
import type { SignUpFormValues } from 'backend/dtos/signUp.dto';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import SEO from 'components/abstract/SEO';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexRowCenter } from 'components/flex-box';
import { extractErrorMessages } from 'helpers/error.helper';
import SignUp from 'pages-sections/auth/SignUp';

const SignUpPage: NextPage = () => {
  const [state, dispatch] = useReducer(infoDialogReducer, initDialogState);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('customer');

  const { mutate: signUp, isLoading } = useMutation<
    AccountWithPopulatedSide<'customer'>,
    any,
    SignUpFormValues
  >({
    mutationFn: (values: SignUpFormValues) => signUpCaller.signUp(values),
    onSuccess: () => {
      setHasError(false);

      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'info',
          title: 'Đăng ký thành công',
          content:
            'Vui lòng kiểm tra email để kích hoạt tài khoản, bạn sẽ được chuyển hướng về trang chủ sau khi tắt thông báo này',
        },
      });
    },
    onError: (error) => {
      const messagesObject = error.data;
      setHasError(true);

      dispatch({
        type: 'open_dialog',
        payload: {
          variant: 'error',
          title: 'Đăng ký thất bại',
          content: extractErrorMessages(
            messagesObject as Record<string, any>,
            t,
          ),
        },
      });
    },
  });

  const handleFormSubmit = async (values: SignUpFormValues) => {
    signUp(values);
  };

  return (
    <>
      <FlexRowCenter flexDirection='column' minHeight='100vh'>
        <SEO title='Sign up' />
        <SignUp loading={isLoading} handleFormSubmit={handleFormSubmit} />
      </FlexRowCenter>

      <InfoDialog
        variant={state.variant}
        open={state.open}
        handleClose={() => {
          dispatch({ type: 'close_dialog' });
          console.log('file: signup.tsx:88 - hasError:', hasError);
          if (!hasError) {
            router.push('/');
          }
        }}
        title={state.title}
        content={state.content}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'customer',
    'account',
  ]);

  return { props: { ...locales } };
};

export default SignUpPage;
