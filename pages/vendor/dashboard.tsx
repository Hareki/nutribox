import { Box, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { ReactElement } from 'react';

import { authOptions } from '../api/auth/[...nextauth]';

import { serialize } from 'api/helpers/object.helper';
import VendorDashboardLayout from 'components/layouts/vendor-dashboard';
import { formatCurrency } from 'lib';
import Analytics from 'pages-sections/dashboard/Analytics';
import RecentOrders from 'pages-sections/dashboard/RecentPurchase';
import StatisticCard from 'pages-sections/dashboard/StatisticCard';
import StatisticProductCard from 'pages-sections/dashboard/StatisticProductCard';
import StockOutProducts from 'pages-sections/dashboard/StockOutProducts';
import TodayCard from 'pages-sections/dashboard/TodayCard';
import apiCaller from 'utils/apiCallers/admin/dashboard';

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
  const { user } = props;
  const { data: statisticData, isLoading } = useQuery({
    queryKey: ['statistic'],
    queryFn: () => apiCaller.getStatisticData(),
  });

  const {
    thisMonthProfit,
    prevMonthProfit,
    thisMonthOrderNumber,
    prevMonthOrderNumber,
  } = statisticData || {};

  const cardSkeleton = (
    <Skeleton
      variant='rectangular'
      animation='wave'
      height='100%'
      width='100%'
      sx={{ borderRadius: '8px' }}
    />
  );

  const tableSkeleton = (
    <Skeleton
      variant='rectangular'
      animation='wave'
      height='400px'
      width='100%'
      sx={{ borderRadius: '8px' }}
    />
  );

  return (
    <Box py={4}>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TodayCard adminFirstName={user?.user?.firstName} />
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticCard
                title='Doanh thu tháng này'
                amount={formatCurrency(thisMonthProfit)}
                subAmount={prevMonthProfit}
                percentage={calculatePercentageDifference(
                  thisMonthProfit,
                  prevMonthProfit,
                )}
                status={thisMonthProfit > prevMonthProfit ? 'up' : 'down'}
              />
            )}
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticCard
                title='Số đơn hàng tháng này'
                amount={thisMonthOrderNumber}
                subAmount={prevMonthOrderNumber}
                percentage={calculatePercentageDifference(
                  thisMonthOrderNumber,
                  prevMonthOrderNumber,
                )}
                status={
                  thisMonthOrderNumber > prevMonthOrderNumber ? 'up' : 'down'
                }
              />
            )}
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticProductCard
                title='Sản phẩm bán chạy nhất'
                soldProducts={statisticData.mostSoldProducts}
                type='most'
              />
            )}
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticProductCard
                title='Sản phẩm bán chậm nhất'
                soldProducts={statisticData.leastSoldProducts}
                type='least'
              />
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Analytics monthlyProfits={statisticData.monthlyProfits} />
        </Grid>

        <Grid item md={6} xs={12}>
          {isLoading ? (
            tableSkeleton
          ) : (
            <RecentOrders data={statisticData.fiveMostRecentOrders} />
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          {isLoading ? (
            tableSkeleton
          ) : (
            <StockOutProducts
              data={statisticData.fiveAlmostOutOfStockProducts}
            />
          )}
        </Grid>
      </Grid>
    </Box>
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

  return {
    props: { user: serialize(session) },
  };
};

function calculatePercentageDifference(
  thisMonthValue: number,
  prevMonthValue: number,
) {
  if (prevMonthValue === 0) {
    // If prevMonthProfit is 0, return 100% if there is any profit this month, otherwise return 0%
    return thisMonthValue > 0 ? 100 : 0;
  }

  const difference = thisMonthValue - prevMonthValue;
  const percentageDifference = (difference / prevMonthValue) * 100;

  return percentageDifference;
}
