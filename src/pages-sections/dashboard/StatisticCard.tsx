import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Card } from '@mui/material';
import type { FC } from 'react';
import React from 'react';

import { H3, Paragraph } from 'components/abstract/Typography';
import { FlexBetween, FlexBox } from 'components/flex-box';

// ========================================================
type StatisticCardProps = {
  title: string;
  amount: string | number;
  subAmount?: string | number;
  percentage?: string | number;
  status?: 'up' | 'down';
};
// ========================================================

const StatisticCard: FC<StatisticCardProps> = (props) => {
  const { title, amount, subAmount, status, percentage } = props;

  return (
    <Card sx={{ p: 2 }}>
      <Paragraph mb={1} color='grey.600'>
        {title}
      </Paragraph>
      <H3 mb={0.3}>{amount}</H3>

      {status && (
        <FlexBetween>
          <Paragraph fontWeight={500} color='grey.500'>
            {subAmount}
          </Paragraph>

          <FlexBox
            alignItems='center'
            color={status === 'up' ? 'success.main' : 'error.main'}
          >
            {status === 'up' && <ArrowDropUp />}
            {status === 'down' && <ArrowDropDown />}
            <Paragraph fontSize={12}>{percentage}%</Paragraph>
          </FlexBox>
        </FlexBetween>
      )}
    </Card>
  );
};

export default StatisticCard;
