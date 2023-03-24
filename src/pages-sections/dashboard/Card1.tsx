import { Card } from '@mui/material';
import type { FC } from 'react';
import React from 'react';

import { H3, H6 } from 'components/abstract/Typography';

// ========================================================
type Card1Props = {
  title: string;
  amount: string | number;
};
// ========================================================

const Card1: FC<Card1Props> = (props) => {
  const { title, amount } = props;

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <H6 mb={1} color='grey.600'>
        {title}
      </H6>
      <H3 mb={0.3}>{amount}</H3>
    </Card>
  );
};

export default Card1;
