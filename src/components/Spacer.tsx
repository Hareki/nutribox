import { Box } from '@mui/material';
import type { FC } from 'react';

type SpacerProps = { mt?: string; mb?: string };

const Spacer: FC<SpacerProps> = ({ mt, mb }) => {
  return <Box mt={mt} mb={mb} />;
};

export default Spacer;
