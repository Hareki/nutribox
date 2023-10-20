import { Chip } from '@mui/material';

import { PaymentMethod } from 'backend/enums/entities.enum';
import { assertNever } from 'helpers/assertion.helper';
import { getPaymentMethodName } from 'helpers/order.helper';
interface OrderPaymentChipProps {
  paymentMethod: PaymentMethod;
}
const OrderPaymentChip = ({ paymentMethod }: OrderPaymentChipProps) => {
  const getColor = (paymentMethod: PaymentMethod) => {
    // return paymentMethod ? 'primary' : 'secondary';
    switch (paymentMethod) {
      case PaymentMethod.COD:
        return 'secondary';
      case PaymentMethod.PayPal:
        return 'primary';
      default:
        assertNever(paymentMethod);
        return '';
    }
  };

  return (
    <Chip
      size='small'
      label={getPaymentMethodName(paymentMethod)}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(paymentMethod)
          ? `${getColor(paymentMethod)}.900`
          : 'inherit',
        backgroundColor: getColor(paymentMethod)
          ? `${getColor(paymentMethod)}.100`
          : 'none',
      }}
    />
  );
};

export default OrderPaymentChip;
