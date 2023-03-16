import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import SEO from 'components/abstract/SEO';
import { FlexRowCenter } from 'components/flex-box';
import { useLoginForm } from 'hooks/useLoginForm';
import Login from 'pages-sections/auth/Login';

const LoginPage: NextPage = () => {
  const router = useRouter();

  const { checkingCredentials, handleFormSubmit, signInResponse, incorrect } =
    useLoginForm();
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
      />
    </FlexRowCenter>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default LoginPage;
