import { Grid } from '@mui/material';
import { Box, Container } from '@mui/system';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useState, Fragment } from 'react';
import type { ReactElement } from 'react';

import { authOptions } from './api/auth/[...nextauth]';

import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import type { IAccount } from 'api/models/Account.model/types';
import type { IAddress } from 'api/types/schema.type';
import SEO from 'components/abstract/SEO';
import { getPageLayout } from 'components/layouts/PageLayout';
import Stepper from 'components/Stepper';
import CartDetails from 'pages-sections/checkout/cart-details';
import Payment from 'pages-sections/checkout/payment';
import apiCaller from 'utils/apiCallers/profile';

Checkout.getLayout = getPageLayout;

interface CheckoutProps {
  initialAccount: IAccount;
}

export interface Step1Data {
  cartItems: IPopulatedCartItem[];
  total: number;
  note: string;
  phone: string;
  address: IAddress;
}

export interface Step2Data {
  accountId: string;
  paid: boolean;
}

type StepData = Step1Data | Step2Data;

function Checkout({ initialAccount }: CheckoutProps): ReactElement {
  const [selectedStep, setSelectedStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data>();

  const nextStep = (data: StepData, currentStep: number) => {
    if (currentStep === 1) {
      setStep1Data(data as Step1Data);
      setSelectedStep(currentStep + 1);
    }
  };
  const prevStep = (currentStep: number) => setSelectedStep(currentStep - 1);

  return (
    <Fragment>
      <SEO title='Thanh toán' />
      <Container sx={{ my: 4 }}>
        <Box mb={3} display={{ sm: 'block', xs: 'none' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stepper stepperList={stepperList} selectedStep={selectedStep} />
            </Grid>
          </Grid>
        </Box>

        {selectedStep === 1 && (
          <CartDetails nextStep={nextStep} account={initialAccount} />
        )}

        {selectedStep === 2 && (
          <Payment
            step1Data={step1Data}
            prevStep={prevStep}
            account={initialAccount}
          />
        )}
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const initialAccount = await apiCaller.getAccount(session.user.id);
  return { props: { initialAccount } };
};

const stepperList = [
  { title: 'Chi tiết đơn hàng', disabled: false },
  { title: 'Thanh toán', disabled: false },
];

export default Checkout;
