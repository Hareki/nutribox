import { useScrollTrigger, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import clsx from 'clsx';
import type { FC, ReactElement } from 'react';

import { slideDown } from 'animations/keyframes';

interface StickyScrollProps {
  children: ReactElement;
}

const StickyScroll: FC<StickyScrollProps> = ({ children }) => {
  const { transitions, shadows } = useTheme();
  const scrolledDown = useScrollTrigger({
    disableHysteresis: true,
    threshold: 70,
  });

  return (
    <Box
      className={clsx({ sticky: scrolledDown })}
      sx={{
        position: 'sticky',
        zIndex: 1000,
        '&[class~="sticky"]': {
          top: 0,
          boxShadow: shadows[2],
          animation: `${slideDown} 400ms ${transitions.easing.easeInOut}`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default StickyScroll;
