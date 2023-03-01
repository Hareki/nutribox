import { Box, Grid } from '@mui/material';
import { GetStaticProps } from 'next';
import { ReactElement } from 'react';

import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import Analytics from 'pages-sections/dashboard/Analytics';
import Card1 from 'pages-sections/dashboard/Card1';
import RecentPurchase from 'pages-sections/dashboard/RecentPurchase';
import Section3 from 'pages-sections/dashboard/Section3';
import StockOutProducts from 'pages-sections/dashboard/StockOutProducts';
import WishCard from 'pages-sections/dashboard/WishCard';
import api from 'utils/__api__/dashboard';

// =============================================================================
VendorDashboard.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================
type DashboardProps = {
  cardList: any[];
  recentPurchase: any[];
  stockOutProducts: any[];
};
// =============================================================================

export default function VendorDashboard(props: DashboardProps) {
  const { cardList, recentPurchase, stockOutProducts } = props;

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        {/* WISHING CARD */}
        <Grid item md={6} xs={12}>
          <WishCard />
        </Grid>

        {/* ALL TRACKING CARDS */}
        <Grid container item md={6} xs={12} spacing={3}>
          {cardList.map((item) => (
            <Grid item md={6} sm={6} xs={12} key={item.id}>
              <Card1
                title={item.title}
                color={item.color}
                amount1={item.amount1}
                amount2={item.amount2}
                percentage={item.percentage}
                status={item.status === 'down' ? 'down' : 'up'}
              />
            </Grid>
          ))}
        </Grid>

        {/* SALES AREA */}
        <Grid item xs={12}>
          <Section3 />
        </Grid>

        {/* ANALYTICS AREA */}
        <Grid item xs={12}>
          <Analytics />
        </Grid>

        {/* RECENT PURCHASE AREA */}
        <Grid item md={7} xs={12}>
          <RecentPurchase data={recentPurchase} />
        </Grid>

        {/* STOCK OUT PRODUCTS */}
        <Grid item md={5} xs={12}>
          <StockOutProducts data={stockOutProducts} />
        </Grid>
      </Grid>
    </Box>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const cardList = await api.getAllCard();
  const recentPurchase = await api.recentPurchase();
  const stockOutProducts = await api.stockOutProducts();
  return { props: { cardList, recentPurchase, stockOutProducts } };
};
