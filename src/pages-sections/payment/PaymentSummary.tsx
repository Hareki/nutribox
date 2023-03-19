import { Divider } from '@mui/material';
import type { FC } from 'react';

import { Paragraph } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import { FlexBetween } from 'components/flex-box';
import { formatCurrency } from 'lib';

const PaymentSummary: FC = () => {
  return (
    <Card1>
      <FlexBetween mb={1}>
        <Paragraph color='grey.600'>Subtotal:</Paragraph>
        <Paragraph fontSize={18} fontWeight={600} lineHeight={1}>
          {formatCurrency(2610)}
        </Paragraph>
      </FlexBetween>

      <FlexBetween mb={1}>
        <Paragraph color='grey.600'>Shipping:</Paragraph>
        <Paragraph fontSize={18} fontWeight={600} lineHeight={1}>
          -
        </Paragraph>
      </FlexBetween>

      <FlexBetween mb={1}>
        <Paragraph color='grey.600'>Tax:</Paragraph>
        <Paragraph fontSize={18} fontWeight={600} lineHeight={1}>
          {formatCurrency(40)}
        </Paragraph>
      </FlexBetween>

      <FlexBetween mb={2}>
        <Paragraph color='grey.600'>Discount:</Paragraph>
        <Paragraph fontSize={18} fontWeight={600} lineHeight={1}>
          -
        </Paragraph>
      </FlexBetween>

      <Divider sx={{ mb: 2 }} />

      <Paragraph
        fontSize={25}
        fontWeight={600}
        lineHeight={1}
        textAlign='right'
      >
        {formatCurrency(2650)}
      </Paragraph>
    </Card1>
  );
};

export default PaymentSummary;
