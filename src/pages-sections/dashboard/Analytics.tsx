import type { SelectChangeEvent } from '@mui/material';
import {
  Card,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import { type FC, useMemo, memo } from 'react';

import ApexChart from './ApexChart';

import { H3 } from 'components/abstract/Typography';
import { FlexBox, FlexRowCenter } from 'components/flex-box';

interface AnalyticsProps {
  monthlyProfits: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  isFetchingMonthlyProfits: boolean;
}

const Analytics: FC<AnalyticsProps> = ({
  monthlyProfits,
  selectedYear,
  setSelectedYear,
  isFetchingMonthlyProfits,
}) => {
  const series = useMemo(
    () => [
      {
        name: 'Doanh thu',
        data: monthlyProfits!,
      },
    ],
    [monthlyProfits],
  );

  const currentYear = new Date().getFullYear();
  const yearSelect = useMemo(
    () => (
      <FlexBox alignItems='center'>
        <FormControl sx={{ m: 1, minWidth: 100 }} size='small'>
          <Select
            labelId='demo-select-small-label'
            id='demo-select-small'
            value={selectedYear.toString()}
            // label='Age'
            onChange={(event: SelectChangeEvent) => {
              setSelectedYear(Number(event.target.value));
            }}
          >
            <MenuItem value={currentYear - 2}>
              {(currentYear - 2).toString()}
            </MenuItem>
            <MenuItem value={currentYear - 1}>
              {(currentYear - 1).toString()}
            </MenuItem>
            <MenuItem value={currentYear.toString()}>
              {currentYear.toString()}
            </MenuItem>
          </Select>
        </FormControl>
      </FlexBox>
    ),
    [currentYear, selectedYear, setSelectedYear],
  );

  return (
    <Card sx={{ p: 3, position: 'relative' }}>
      <FlexRowCenter>
        <H3>Doanh thu theo 12 tháng trong năm </H3>
        {yearSelect}
      </FlexRowCenter>
      {isFetchingMonthlyProfits && (
        <CircularProgress
          size={30}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '20px',
          }}
        />
      )}
      {/* <ReactApexChart
        type='bar'
        height={300}
        series={series}
        options={{ ...analyticsChartOptions(theme, categories), ...options }}
      /> */}
      <ApexChart series={series} />
    </Card>
  );
};

export default memo(Analytics);
