import { Box, Divider } from '@mui/material';
import type { FC } from 'react';

import type { Step1Data } from '../../../../pages/checkout';

import { Paragraph, Span } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';
import { formatCurrency } from 'lib';

interface PaymentSummaryProps {
  step1Data: Step1Data;
}

const PaymentSummary: FC<PaymentSummaryProps> = ({ step1Data }) => {
  return (
    <Box>
      <Paragraph color='secondary.900' fontWeight={700} mb={2}>
        Chi tiết đơn hàng
      </Paragraph>

      {step1Data.cartItems.map((item) => (
        <FlexBetween mb={1.5} key={item.product.name}>
          <Paragraph>
            <Span fontWeight='700' fontSize='14px'>
              {item.quantity}
            </Span>{' '}
            x {item.product.name}
          </Paragraph>
          <Paragraph>{formatCurrency(item.product.retailPrice)}</Paragraph>
        </FlexBetween>
      ))}

      <Divider sx={{ borderColor: 'grey.300', my: 3 }} />

      <FlexBetween fontWeight='700' mb={1}>
        <Paragraph>Total:</Paragraph>
        <Paragraph fontWeight='700'>
          {formatCurrency(step1Data.total)}
        </Paragraph>
      </FlexBetween>

      <Divider sx={{ borderColor: 'grey.300', mb: 1 }} />

      <Box mb={1.5}>
        <Paragraph color='grey.600'>Số điện thoại:</Paragraph>
        <Paragraph>{step1Data.phone}</Paragraph>
      </Box>

      <Box mb={1.5}>
        <Paragraph color='grey.600'>Địa chỉ</Paragraph>
        <Paragraph>{step1Data.fullAddress}</Paragraph>
      </Box>

      <Box>
        <Paragraph color='grey.600'>Ghi chú:</Paragraph>
        <Paragraph>{step1Data.note ? step1Data.note : '-'}</Paragraph>
      </Box>
    </Box>
  );
};

export default PaymentSummary;
