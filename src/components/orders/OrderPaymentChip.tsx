import { Chip } from '@mui/material';
interface OrderPaymentChipProps {
  paid: boolean;
}
const OrderPaymentChip = ({ paid }: OrderPaymentChipProps) => {
  const getColor = (paid: boolean) => {
    return paid ? 'primary' : 'secondary';
  };

  return (
    <Chip
      size='small'
      label={paid ? 'Online' : 'COD'}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(paid) ? `${getColor(paid)}.900` : 'inherit',
        backgroundColor: getColor(paid) ? `${getColor(paid)}.100` : 'none',
      }}
    />
  );
};

export default OrderPaymentChip;
