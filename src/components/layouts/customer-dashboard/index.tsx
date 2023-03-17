import { Container, Grid } from '@mui/material';
import { FC, ReactNode } from 'react';

import ShopLayout1 from '../ShopLayout1';

import Navigations from './Navigations';

import { Footer } from 'components/common/layout/footer';

/**
 *  Used in:
 *  1. wish-list page
 *  2. address and address-details page
 *  3. orders and order-details page
 *  4. payment-methods and payment-method-details page
 *  5. profile and edit profile page
 *  6. support-tickets page
 */
// ======================================================
type Props = { children: ReactNode };
// ======================================================

const CustomerDashboardLayout: FC<Props> = ({ children }) => (
  <ShopLayout1 showNavbar={false} showTopbar={false}>
    <Container sx={{ my: '6rem' }}>
      <Grid container spacing={3}>
        <Grid
          item
          lg={3}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        >
          <Navigations />
        </Grid>

        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
    <Footer />
  </ShopLayout1>
);

export default CustomerDashboardLayout;
