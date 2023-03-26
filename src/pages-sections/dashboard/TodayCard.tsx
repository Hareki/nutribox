import { Box, Card } from '@mui/material';
import NextImage from 'next/legacy/image';
import type { FC } from 'react';

import { H3, H5, Paragraph } from 'components/abstract/Typography';
import { formatCurrency } from 'lib';

interface TodayCardProps {
  adminFirstName: string;
  todayOrderNumber: number;
  todayProfit: number;
}

const TodayCard: FC<TodayCardProps> = ({
  adminFirstName,
  todayOrderNumber,
  todayProfit,
}) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <H5 color='primary.main' mb={0.5}>
        Xin chào {adminFirstName}!
      </H5>
      <Paragraph color='grey.600'>
        Đây là những gì diễn ra trong ngày hôm nay
      </Paragraph>

      <H3 mt={1.5}>{formatCurrency(todayProfit)}</H3>
      <Paragraph color='grey.600'>Doanh thu</Paragraph>

      <H3 mt={3}>{todayOrderNumber}</H3>
      <Paragraph color='grey.600'>Đơn hàng </Paragraph>

      <Box
        sx={{
          right: 24,
          bottom: 0,
          position: 'absolute',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <NextImage
          src='/assets/images/illustrations/dashboard/welcome.svg'
          width={195}
          height={171}
          alt='Welcome'
        />
      </Box>
    </Card>
  );
};

export default TodayCard;
