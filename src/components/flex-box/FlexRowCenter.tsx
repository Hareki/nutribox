import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';

const FlexRowCenter: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box display='flex' justifyContent='center' alignItems='center' {...props}>
    {children}
  </Box>
);

export default FlexRowCenter;
