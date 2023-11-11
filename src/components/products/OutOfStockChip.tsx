import styled from '@emotion/styled';
import { Chip } from '@mui/material';
import type { FC } from 'react';

interface StyledChipProps {
  top: string;
  left: string;
}

const StyledChip = styled(Chip)<StyledChipProps>(({ top, left }) => ({
  zIndex: 1,
  top,
  left,
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: '10px',
  position: 'absolute',
}));

interface OutOfStockChipProps {
  top?: string;
  left?: string;
}
const OutOfStockChip: FC<OutOfStockChipProps> = ({ top, left }) => {
  return (
    <StyledChip
      label='Hết hàng'
      color='secondary'
      size='small'
      top={top || '0'}
      left={left || '0'}
    />
  );
};

OutOfStockChip.defaultProps = {
  top: '10px',
  left: '10px',
};

export default OutOfStockChip;
