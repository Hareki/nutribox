import { useMutation } from '@tanstack/react-query';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReducer, useState } from 'react';

import signUpCaller from 'api-callers/sign-up';
import type { SignUpFormValues } from 'backend/dtos/signUp.dto';
import type { AccountWithPopulatedSide } from 'backend/types/auth';
import SEO from 'components/abstract/SEO';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexRowCenter } from 'components/flex-box';
import { extractErrorMessages } from 'helpers/error.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import SignUp from 'pages-sections/auth/SignUp';

const SignUpPage: NextPage = () => {
  const [state, dispatch] = useReducer(infoDialogReducer, initInfoDialogState);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { t } = useCustomTranslation(['customer', 'account']);

  const { mutate: signUp, isLoading } = useMutation<
    AccountWithPopulatedSide<'customer'>,
    Record<string, string>,
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
      const messagesObject = error;
      setHasError(true);

      try {
        dispatch({
          type: 'open_dialog',
          payload: {
            variant: 'error',
            title: 'Đăng ký thất bại',
            content: extractErrorMessages(messagesObject, t),
          },
        });
      } catch (error) {
        console.log('error:', error);
      }
    },
  });

  const handleFormSubmit = async (values: SignUpFormValues) => {
    signUp(values);
  };

  return (
    <>
      <FlexRowCenter flexDirection='column' minHeight='100vh'>
        <SEO title='Đăng ký' />
        <SignUp
          loading={isLoading}
          disabled={isRedirecting}
          handleFormSubmit={handleFormSubmit}
        />
      </FlexRowCenter>

      <InfoDialog
        variant={state.variant}
        open={state.open}
        handleClose={() => {
          dispatch({ type: 'close_dialog' });
          if (!hasError) {
            setIsRedirecting(true);
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
