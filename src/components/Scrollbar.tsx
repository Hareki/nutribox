import type { SxProps } from '@mui/material';
import { alpha, styled } from '@mui/material';
import type { FC, ReactNode } from 'react';
import SimpleBar from 'simplebar-react';

const StyledScrollBar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&.simplebar-visible:before': { opacity: 1 },
    '&:before': { backgroundColor: alpha(theme.palette.grey[400], 0.6) },
  },
  '& .simplebar-track.simplebar-vertical': { width: 9 },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': { height: 6 },
  '& .simplebar-mask': { zIndex: 'inherit' },
}));

// =============================================================
interface ScrollbarProps extends SimpleBar.Props {
  sx?: SxProps;
  children: ReactNode;
}
// =============================================================

const Scrollbar: FC<ScrollbarProps> = ({ children, sx, ...props }) => {
  return (
    <StyledScrollBar sx={sx} {...props}>
      {children}
    </StyledScrollBar>
  );
};

export default Scrollbar;
