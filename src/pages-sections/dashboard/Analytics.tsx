import { Card, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

import { analyticsChartOptions } from './chartsOptions';

import { H3 } from 'components/abstract/Typography';
import { FlexRowCenter } from 'components/flex-box';
import { formatCurrency, formatNumber } from 'lib';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const categories = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
];

interface AnalyticsProps {
  monthlyProfits: number[];
}

const Analytics: FC<AnalyticsProps> = ({ monthlyProfits }) => {
  const theme = useTheme();

  const series = [
    {
      name: 'Doanh thu',
      data: monthlyProfits,
    },
  ];

  const options = {
    yaxis: {
      min: 0,
      max: Math.max(...series[0].data) + 10000,
      labels: {
        formatter(value) {
          return formatCurrency(value);
        },
      },
    },
  };

  return (
    <Card sx={{ p: 3 }}>
      <FlexRowCenter>
        <H3>Doanh thu theo tháng</H3>
      </FlexRowCenter>

      <ReactApexChart
        type='bar'
        height={300}
        series={series}
        options={{ ...analyticsChartOptions(theme, categories), ...options }}
      />
    </Card>
  );
};

export default Analytics;
