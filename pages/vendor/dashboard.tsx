import { Box, Grid } from '@mui/material';
import type { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { ReactElement } from 'react';

import { authOptions } from '../api/auth/[...nextauth]';

import { serialize } from 'api/helpers/object.helper';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { formatCurrency } from 'lib';
import Card1 from 'pages-sections/dashboard/Card1';
import RecentPurchase from 'pages-sections/dashboard/RecentPurchase';
import StockOutProducts from 'pages-sections/dashboard/StockOutProducts';
import WishCard from 'pages-sections/dashboard/WishCard';
import api from 'utils/__api__/dashboard';

VendorDashboard.getLayout = function getLayout(page: ReactElement) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
type DashboardProps = {
  cardList: any[];
  recentPurchase: any[];
  stockOutProducts: any[];
  // Not allowed to name a variable 'session' because it is a reserved word?
  user: Session;
};

export default function VendorDashboard(props: DashboardProps) {
  const { recentPurchase, stockOutProducts, user } = props;

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <WishCard adminFirstName={user?.user?.firstName} />
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
          <Grid item md={6} sm={6} xs={12}>
            <Card1
              title={placeholders[0].title}
              amount={placeholders[0].amount1}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Card1
              title={placeholders[1].title}
              amount={placeholders[1].amount1}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Card1
              title={placeholders[2].title}
              amount={formatCurrency(parseInt(placeholders[2].amount1))}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Card1
              title={placeholders[3].title}
              amount={placeholders[3].amount1}
            />
          </Grid>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const recentPurchase = await api.recentPurchase();
  const stockOutProducts = await api.stockOutProducts();

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user: serialize(session), recentPurchase, stockOutProducts },
  };
};

const placeholders = [
  {
    amount1: '32,350',
    title: 'Tổng đơn hàng',
  },
  {
    amount1: '2,360',
    title: 'Tổng sản phẩm bán được',
  },
  {
    amount1: '12460',
    title: 'Tổng doanh thu',
  },
  {
    amount1: '$6,240',
    title: 'Số loại sản phẩm',
  },
];
