import { Box, Button, styled } from '@mui/material';
import type { FC } from 'react';

import { H1 } from 'components/abstract/Typography';

const leftImg = '/assets/images/headers/Header BG1.png';
const rightImg = '/assets/images/headers/Header BG2.png';

const StyledButton = styled(Button)({
  color: '#fff',
  fontWeight: 400,
  fontSize: '16px',
});

// styled component
const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 650,
  padding: 20,
  paddingTop: 160,
  backgroundColor: theme.palette.grey[100],
  backgroundSize: '40%, 40%',
  backgroundPosition: 'left bottom, right bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
  transition: 'all .3s',
  backgroundImage:
    theme.direction === 'ltr'
      ? `url('${leftImg}'), url('${rightImg}')`
      : `url('${rightImg}'), url('${leftImg}')`,

  '& h1': {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 1.3,
  },
  '& .actionButton': {
    margin: 'auto',
    maxWidth: '600px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    // boxShadow: theme.shadows[2],
  },
  [theme.breakpoints.up('md')]: {
    backgroundSize: '450px, 450px',
  },
  [theme.breakpoints.down('md')]: {
    height: 550,
    paddingTop: 130,
    '& h1': { fontSize: 38, textAlign: 'center' },
  },
  [theme.breakpoints.down('sm')]: {
    height: 480,
    paddingTop: 100,
    '& h1': { fontSize: 30 },
    '& .actionButton': { margin: 0 },
  },
}));

const HeroSection: FC = () => {
  return (
    <Container>
      <H1 maxWidth={600} mx='auto'>
        Đặt mua và nhận hàng tận nơi trong vòng 30 phút
      </H1>

      <Box className='actionButton'>
        <StyledButton
          variant='contained'
          color='primary'
          sx={{ px: '30px', py: '6px' }}
        >
          Đặt mua ngay
        </StyledButton>
      </Box>
    </Container>
  );
};

export default HeroSection;
