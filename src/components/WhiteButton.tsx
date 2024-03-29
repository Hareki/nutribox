import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import type { FC } from 'react';

// ==================================================
type WhiteButtonProps = { children: any };
// ==================================================

const WhiteButton: FC<WhiteButtonProps & ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      color='dark'
      variant='contained'
      sx={{
        color: 'dark.main',
        backgroundColor: 'white',
        ':hover': { backgroundColor: 'dark.main', color: '#fff' },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default WhiteButton;
