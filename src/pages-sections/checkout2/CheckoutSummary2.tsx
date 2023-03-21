import { Box, Divider } from '@mui/material';
import type { FC } from 'react';

import type { Step1Data } from '../../../pages/checkout';

import { Paragraph, Span } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';
import { formatCurrency } from 'lib';

interface PaymentSummaryProps {
  step1Data: Step1Data;
}

const PaymentSummary: FC<PaymentSummaryProps> = ({step1Data}) => {
  return (
    <Box>
      <Paragraph color='secondary.900' fontWeight={700} mb={2}>
        Chi tiết đơn hàng
      </Paragraph>

      {cartList.map((item) => (
        <FlexBetween mb={1.5} key={item.name}>
          <Paragraph>
            <Span fontWeight='700' fontSize='14px'>
              {item.quantity}
            </Span>{' '}
            x {item.name}
          </Paragraph>
          <Paragraph>{formatCurrency(item.price)}</Paragraph>
        </FlexBetween>
      ))}

      <Divider sx={{ borderColor: 'grey.300', my: 3 }} />

      <FlexBetween fontWeight='700' mb={1}>
        <Paragraph>Total:</Paragraph>
        <Paragraph fontWeight='700'>{formatCurrency(2650)}</Paragraph>
      </FlexBetween>

      <Divider sx={{ borderColor: 'grey.300', mb: 1 }} />

      <Box mb={1.5}>
        <Paragraph color='grey.600'>Số điện thoại:</Paragraph>
        <Paragraph>033-875-8008</Paragraph>
      </Box>

      <Box mb={1.5}>
        <Paragraph color='grey.600'>Địa chỉ</Paragraph>
        <Paragraph>
          12/12 Đường 49, Phường Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh
        </Paragraph>
      </Box>

      <Box>
        <Paragraph color='grey.600'>Ghi chú:</Paragraph>
        <Paragraph>-</Paragraph>
      </Box>
    </Box>
  );
};

const cartList = [
  { name: 'iPhone 12', quantity: 1, price: 999 },
  { name: 'iPhone 12 pro', quantity: 1, price: 1199 },
  { name: 'iPhone 12 pro max', quantity: 1, price: 1299 },
];

export default PaymentSummary;
