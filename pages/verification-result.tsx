import { Button, Container, styled } from '@mui/material';
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment } from 'react';

import { type ResendVerificationEmailDto } from 'backend/dtos/resendVerificationEmail';
import { AccountService } from 'backend/services/account/account.service';
import SEO from 'components/abstract/SEO';
import BazaarCard from 'components/common/BazaarCard';
import { getPageLayout } from 'components/layouts/PageLayout';
import VerificationResultComp from 'components/VerificationResultComp';

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
  return (
    <Fragment>
      <SEO title={verified ? 'Xác thực thành công' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        <VerificationResultComp verified={verified} isEmployee={false} />
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
    'common',
  ]);

  return {
    props: {
      verified,
      ...locales,
    },
  };
};

export default VerificationResult;
