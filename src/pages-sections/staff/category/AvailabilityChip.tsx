import { Chip } from '@mui/material';

interface OrderStatusChipProps {
  available: boolean;
}
const AvailabilityChip = ({ available }: OrderStatusChipProps) => {
  return (
    <Chip
      size='small'
      label={available ? 'Kinh doanh' : 'Tạm nghỉ'}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(available) ? `${getColor(available)}.900` : 'inherit',
        backgroundColor: getColor(available)
          ? `${getColor(available)}.100`
          : 'none',
      }}
    />
  );
};

const getColor = (available: boolean) => {
  switch (available) {
    case true:
      return 'primary';

    case false:
      return 'error';

    default:
      return '';
  }
};

export default AvailabilityChip;
