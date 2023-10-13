import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { useEffect, useState } from 'react';

import { authOptions } from './api/auth/[...nextauth]';

import SEO from 'components/abstract/SEO';
import { FlexRowCenter } from 'components/flex-box';
import { useLoginForm } from 'hooks/useLoginForm';
import Login from 'pages-sections/auth/Login';

const LoginPage: NextPage = () => {
  const router = useRouter();

  const {
    checkingCredentials,
    handleFormSubmit,
    signInResponse,
    incorrect,
    verified,
  } = useLoginForm();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (signInResponse && signInResponse.ok) {
      setRedirecting(true);
      router.push('/');
    }
  }, [signInResponse, router]);

  return (
    <FlexRowCenter flexDirection='column' minHeight='100vh'>
      <SEO title='Login' />
      <Login
        loading={checkingCredentials || redirecting}
        handleFormSubmit={handleFormSubmit}
        incorrect={incorrect}
        verified={verified}
      />
    </FlexRowCenter>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    // return {
    //   redirect: {
    //     destination: '/',
    //     permanent: false,
    //   },
    // };
    return {
      notFound: true,
    };
  }

  return {
    props: { session },
  };
};

export default LoginPage;