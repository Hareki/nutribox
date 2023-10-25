import { useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { memo, useMemo } from 'react';

import { analyticsChartOptions } from './chartsOptions';

import { formatCurrency } from 'lib';

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

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

const ApexChart: FC<Props> = ({ series }) => {
  const theme = useTheme();

  const options = useMemo(
    () => ({
      yaxis: {
        min: 0,
        max: Math.max(...series[0].data) + 10000,
        labels: {
          formatter(value) {
            return formatCurrency(value);
          },
        },
      },
    }),
    [series],
  );

  return (
    <ReactApexChart
      type='bar'
      height={300}
      series={series}
      options={{ ...analyticsChartOptions(theme, categories), ...options }}
    />
  );
};

export default memo(ApexChart);
