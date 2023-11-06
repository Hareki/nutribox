import { Chip } from '@mui/material';

interface Props {
  disabled: boolean;
}
const DisabledStatusChip = ({ disabled }: Props) => {
  const statusName = disabled ? 'Đã khóa' : 'Đang hoạt động';

  return (
    <Chip
      size='small'
      label={statusName}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(disabled) ? `${getColor(disabled)}.900` : 'inherit',
        backgroundColor: getColor(disabled)
          ? `${getColor(disabled)}.100`
          : 'none',
      }}
    />
  );
};

const getColor = (disabled: boolean) => {
  switch (disabled) {
    case true:
      return 'error';

    case false:
      return 'success';

    default:
      return '';
  }
};

export default DisabledStatusChip;
