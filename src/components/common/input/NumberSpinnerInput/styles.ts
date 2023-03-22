import { styled } from '@mui/material';

const StyledNumberSpinner = styled('div')(({ theme }) => ({
  width: '140px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '2px solid rgba(0, 0, 0, 0.23)',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  '&:focus-within': {
    border: `2px solid ${theme.palette.primary.main} !important`,
  },
  '& input': {
    border: 'none',
    outline: 'none',
    width: '40px',
    fontSize: '18px',
    fontWeight: 500,
    textAlign: 'center',
    height: 'inherit',
    '&::-webkit-outer-spin-button': {
      margin: 0,
      appearance: 'none',
    },
    '&::-webkit-inner-spin-button': {
      margin: 0,
      appearance: 'none',
    },
    '&[type="number"]': {
      appearance: 'textfield',
    },
  },
}));
export default StyledNumberSpinner;
