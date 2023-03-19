import { Container, Grid } from '@mui/material';
import type { NextPage } from 'next';

import SEO from 'components/abstract/SEO';
import ShopLayout1 from 'components/layouts/ShopLayout1';
import CheckoutForm2 from 'pages-sections/checkout2/CheckoutForm2';
import CheckoutSummary2 from 'pages-sections/checkout2/CheckoutSummary2';

const CheckoutAlternative: NextPage = () => {
  return (
    <ShopLayout1>
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
    </ShopLayout1>
  );
};

export default CheckoutAlternative;
