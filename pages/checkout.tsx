import { Grid } from '@mui/material';
import { Box, Container } from '@mui/system';
import type { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';
import { useState, Fragment } from 'react';

import type { CommonCartItem } from 'backend/services/product/helper';
import SEO from 'components/abstract/SEO';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { getPageLayout } from 'components/layouts/PageLayout';
import Stepper from 'components/Stepper';
import type { IAddress } from 'helpers/address.helper';
import CartDetails from 'pages-sections/checkout/cart-details';
import OrderCompleted from 'pages-sections/checkout/order-completed';
import Payment from 'pages-sections/checkout/payment';

Checkout.getLayout = getPageLayout;

export interface Step1Data {
  selectedCartItems: CommonCartItem[];
  total: number;
  note?: string;
  phone: string;
  address: IAddress;

  deliveryTime: Date;
  distance: number;
}

type StepData = Step1Data;

function Checkout(): ReactElement {
  const { data: session } = useSession();
  const account = session?.account;

  const [selectedStep, setSelectedStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data>();

  const nextStep = (data: StepData | undefined, currentStep: number) => {
    if (currentStep === 1) {
      setStep1Data(data as Step1Data);
      setSelectedStep(currentStep + 1);
      return;
    }
    if (currentStep === 2) {
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

        {!account && <CircularProgressBlock />}

        {account && selectedStep === 1 && (
          <CartDetails nextStep={nextStep} account={account} />
        )}
        {account && selectedStep === 2 && (
          <Payment
            step1Data={step1Data!}
            prevStep={prevStep}
            nextStep={nextStep}
            account={account}
          />
        )}
        {account && selectedStep === 3 && <OrderCompleted />}
      </Container>
    </Fragment>
  );
}

const stepperList = [
  { title: 'Chi tiết đơn hàng', disabled: false },
  { title: 'Thanh toán', disabled: false },
];

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'customerOrder',
    'common',
  ]);

  return { props: { ...locales } };
};

export default Checkout;
