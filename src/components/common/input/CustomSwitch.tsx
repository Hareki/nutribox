import type { SwitchProps } from '@mui/material';
import { styled, Switch } from '@mui/material';
import type { FC } from 'react';

// styled component
const StyledSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-switchBase.MuiButtonBase-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.grey[400],
    '&:before, &:after': {
      width: 16,
      height: 16,
      top: '50%',
      content: '""',
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  },
  '& .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    margin: '2px',
    boxShadow: 'none',
    backgroundColor: theme.palette.grey[600],
  },
  '& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb': {
    backgroundColor: theme.palette.primary.main,
  },
  // .Mui-disabled+.MuiSwitch-track
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    opacity: 0.4,
  },
  '& .MuiSwitch-switchBase.Mui-disabled:not([class~=Mui-checked]) + .MuiSwitch-track':
    {
      opacity: 1,
    },
}));

const CustomSwitch: FC<SwitchProps> = (props) => <StyledSwitch {...props} />;

export default CustomSwitch;
