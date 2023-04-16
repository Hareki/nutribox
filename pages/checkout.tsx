import { Grid } from '@mui/material';
import { Box, Container } from '@mui/system';
import type { GetServerSideProps } from 'next';
import { useState, Fragment } from 'react';
import type { ReactElement } from 'react';

import { getAccount } from 'api/base/server-side-modules';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import type { IAccount } from 'api/models/Account.model/types';
import type { IAddress } from 'api/types/schema.type';
import SEO from 'components/abstract/SEO';
import { getPageLayout } from 'components/layouts/PageLayout';
import Stepper from 'components/Stepper';
import CartDetails from 'pages-sections/checkout/cart-details';
import OrderCompleted from 'pages-sections/checkout/order-completed';
import Payment from 'pages-sections/checkout/payment';

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

  estimatedDeliveryTime: Date;
  estimatedDistance: number;
}

export interface Step2Data {
  accountId: string;
  paid: boolean;
}

type StepData = Step1Data | Step2Data;

function Checkout({ initialAccount }: CheckoutProps): ReactElement {
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

        {selectedStep === 1 && (
          <CartDetails nextStep={nextStep} account={initialAccount} />
        )}

        {selectedStep === 2 && (
          <Payment
            step1Data={step1Data}
            prevStep={prevStep}
            nextStep={nextStep}
            account={initialAccount}
          />
        )}

        {selectedStep === 3 && <OrderCompleted />}
      </Container>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult, session } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  const initialAccount = await getAccount(session.user.id);
  return { props: { initialAccount: serialize(initialAccount) } };
};

const stepperList = [
  { title: 'Chi tiết đơn hàng', disabled: false },
  { title: 'Thanh toán', disabled: false },
];

export default Checkout;
