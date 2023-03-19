import { Box, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import type { ReactNode, ReactElement } from 'react';
import { useState } from 'react';

import PageLayout from './PageLayout';

import Stepper from 'components/Stepper';

/**
 *  Used:
 *  1. cart page
 *  2. checkout page
 *  3. payment page
 */

// ======================================================
type CheckoutNavLayoutProps = { children: ReactNode };

// ======================================================
CheckoutNavLayout.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

function CheckoutNavLayout({ children }: CheckoutNavLayoutProps) {
  const [selectedStep, setSelectedStep] = useState(0);

  const router = useRouter();
  const { pathname } = router;

  const nextStep = () => setSelectedStep((prev) => prev + 1);
  const prevStep = () => setSelectedStep((prev) => prev - 1);

  return (
    <Container sx={{ my: 4 }}>
      <Box mb={3} display={{ sm: 'block', xs: 'none' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stepper stepperList={stepperList} selectedStep={selectedStep} />
          </Grid>
        </Grid>
      </Box>

      {children}
    </Container>
  );
}

const stepperList = [
  { title: 'Chi tiết giỏ hàng', disabled: false },
  { title: 'Thanh toán', disabled: false },
];

export default CheckoutNavLayout;
