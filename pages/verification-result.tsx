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
import VerificationResultComp from 'components/VerificationResultComp';
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
  return (
    <Fragment>
      <SEO title={verified ? 'Xác thực thành công' : 'Xác thực thất bại'} />

      <Container sx={{ mt: 6, mb: 20 }}>
        <VerificationResultComp verified={verified} />
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
