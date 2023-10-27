import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { useState, type ReactElement } from 'react';

import dashboardCaller from 'api-callers/staff/dashboard';
import { H3 } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import { formatCurrency } from 'lib';
import Analytics from 'pages-sections/dashboard/Analytics';
import RecentOrders from 'pages-sections/dashboard/RecentOrders';
import StatisticCard from 'pages-sections/dashboard/StatisticCard';
import StatisticProductCard from 'pages-sections/dashboard/StatisticProductCard';
import StockOutProducts from 'pages-sections/dashboard/StockOutProducts';
import TodayCard from 'pages-sections/dashboard/TodayCard';

VendorDashboard.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

export default function VendorDashboard() {
  const { data: session } = useSession();
  const userName = session?.employeeAccount.employee.firstName;

  const {
    data: dashboardData,
    isLoading: isLoadingData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['statistic'],
    queryFn: () => dashboardCaller.getDashboardData(),
    staleTime: Infinity,
  });

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    data: monthlyProfits,
    // isLoading: isLoadingMonthlyProfits,
    // refetch: refetchMonthlyProfits,
    isFetching: isFetchingMonthlyProfits,
  } = useQuery({
    queryKey: ['statistic', 'monthlyProfits', selectedYear],
    queryFn: ({ queryKey }) =>
      dashboardCaller.getMonthlyProfits(queryKey[2] as number),
    initialData: [0],
  });

  const isLoading = isLoadingData || !session;

  const todayCardSkeleton = (
    <Skeleton
      variant='rectangular'
      animation='wave'
      height='350px'
      width='100%'
      sx={{ borderRadius: '8px' }}
    />
  );
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
  const theme = useTheme();

  return (
    <Box py={4}>
      <FlexBox alignItems='center' mb={2} gap={1}>
        <H3>Thống kê</H3>
        <IconButton
          disabled={isFetching}
          onClick={async () => {
            await refetch();
            enqueueSnackbar('Đã cập nhật dữ liệu', { variant: 'success' });
          }}
        >
          {isFetching ? (
            <CircularProgress size={25.71} />
          ) : (
            <ReplayRoundedIcon style={{ color: theme.palette.primary.main }} />
          )}
        </IconButton>
      </FlexBox>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          {isLoading ? (
            todayCardSkeleton
          ) : (
            <TodayCard
              adminFirstName={userName || ''}
              // Can't be undefined, since isLoading is false
              todayOrderNumber={dashboardData!.todayOrderNumber}
              todayProfit={dashboardData!.todayProfit}
            />
          )}
        </Grid>

        <Grid container item md={6} xs={12} spacing={3}>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticCard
                title='Doanh thu tháng này'
                amount={formatCurrency(dashboardData!.thisMonthProfit)}
                subAmount={formatCurrency(dashboardData!.prevMonthProfit)}
                percentage={calculatePercentageDifference(
                  dashboardData!.thisMonthProfit,
                  dashboardData!.prevMonthProfit,
                )}
                status={
                  dashboardData!.thisMonthProfit >
                  dashboardData!.prevMonthProfit
                    ? 'up'
                    : 'down'
                }
              />
            )}
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticCard
                title='Số đơn hàng tháng này'
                amount={dashboardData!.thisMonthOrderNumber}
                subAmount={dashboardData!.prevMonthOrderNumber}
                percentage={calculatePercentageDifference(
                  dashboardData!.thisMonthOrderNumber,
                  dashboardData!.prevMonthOrderNumber,
                )}
                status={
                  dashboardData!.thisMonthOrderNumber >
                  dashboardData!.prevMonthOrderNumber
                    ? 'up'
                    : 'down'
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
                soldProducts={dashboardData!.mostSoldProducts}
                type='mostSold'
              />
            )}
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {isLoading ? (
              cardSkeleton
            ) : (
              <StatisticProductCard
                title='Sản phẩm bán chậm nhất'
                soldProducts={dashboardData!.leastSoldProducts}
                type='leastSold'
              />
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {isLoading ? (
            tableSkeleton
          ) : (
            <Analytics
              isFetchingMonthlyProfits={isFetchingMonthlyProfits}
              monthlyProfits={monthlyProfits}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          {isLoading ? (
            tableSkeleton
          ) : (
            <RecentOrders data={dashboardData!.fiveMostRecentOrders} />
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          {isLoading ? (
            tableSkeleton
          ) : (
            <StockOutProducts data={dashboardData!.fiveLeastInStockProduct} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

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
