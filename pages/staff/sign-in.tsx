import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import SEO from 'components/abstract/SEO';
import { FlexRowCenter } from 'components/flex-box';
import { useLoginForm } from 'hooks/useLoginForm';
import SignIn from 'pages-sections/auth/SignIn';
import { getDefaultStaffRoute } from 'utils/middleware.helper';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    checkingCredentials,
    handleFormSubmit,
    signInResponse,
    errorMessage,
  } = useLoginForm('employee');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (signInResponse?.ok && session?.employeeAccount.employee.role) {
      setRedirecting(true);
      router.push(getDefaultStaffRoute(session.employeeAccount.employee.role));
    }
  }, [signInResponse, router, session]);

  return (
    <FlexRowCenter
      flexDirection='column'
      minHeight='100vh'
      sx={{
        backgroundImage: 'url("assets/backgrounds/gradient-bg.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      <SEO title='Đăng nhập' />
      <SignIn
        userType='employee'
        loading={checkingCredentials || redirecting}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
      />
    </FlexRowCenter>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'account',
    'common',
  ]);

  return { props: { ...locales } };
};

export default LoginPage;
