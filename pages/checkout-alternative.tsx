import { Container, Grid } from '@mui/material';
import { NextPage } from 'next';

import ShopLayout from 'components/layouts/ShopLayout';
import SEO from 'components/SEO';
import CheckoutForm2 from 'pages-sections/checkout/CheckoutForm2';
import CheckoutSummary2 from 'pages-sections/checkout/CheckoutSummary2';

const CheckoutAlternative: NextPage = () => {
  return (
    <ShopLayout>
      <SEO title='Checkout alternative' />
      <Container sx={{ my: '1.5rem' }}>
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} xs={12}>
            <CheckoutForm2 />
          </Grid>

          <Grid item lg={4} md={4} xs={12}>
            <CheckoutSummary2 />
          </Grid>
        </Grid>
      </Container>
    </ShopLayout>
  );
};

export default CheckoutAlternative;
