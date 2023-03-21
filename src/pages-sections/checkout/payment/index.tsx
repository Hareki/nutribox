import { Grid } from '@mui/material';
import type { ReactElement } from 'react';

import type { Step1Data } from '../../../../pages/checkout';

import PaymentForm from './PaymentForm';
import PaymentSummary from './PaymentSummary';

import type { IAccount } from 'api/models/Account.model/types';
import PageLayout from 'components/layouts/PageLayout';

Payment.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

interface PaymentProps {
  step1Data: Step1Data;
  prevStep: (currentStep: number) => void;
  account: IAccount;
}

function Payment({ account, prevStep, step1Data }: PaymentProps): ReactElement {
  return (
    <Grid container flexWrap='wrap-reverse' spacing={4}>
      <Grid item lg={7.5} md={7.5} xs={12}>
        <PaymentForm prevStep={prevStep} />
      </Grid>

      <Grid item lg={4.5} md={4.5} xs={12}>
        <PaymentSummary step1Data={step1Data} />
      </Grid>
    </Grid>
  );
}

export default Payment;
