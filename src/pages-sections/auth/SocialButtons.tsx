import { Box, Button, Divider } from '@mui/material';
import type { FC } from 'react';
import { Fragment } from 'react';

import MuiImage from 'components/common/input/MuiImage';
import { FlexBox } from 'components/flex-box';

// =======================================
type SocialButtonsProps = {
  handleGoogle?: () => void;
  handleFacebook?: () => void;
};
// =======================================

const SocialButtons: FC<SocialButtonsProps> = (props) => {
  return (
    <Fragment>
      <Box mb={3} mt={3.8}>
        <Box width='200px' mx='auto'>
          <Divider />
        </Box>

        <FlexBox justifyContent='center' mt={-1.625}>
          <Box color='grey.600' bgcolor='background.paper' px={2}>
            hoặc
          </Box>
        </FlexBox>
      </Box>

      <Button
        className='facebookButton'
        size='medium'
        fullWidth
        sx={{ height: 44 }}
      >
        <MuiImage
          src='/assets/images/icons/facebook-filled-white.svg'
          alt='facebook'
        />
        <Box fontSize='12px' ml={1}>
          Tiếp tục với Facebook
        </Box>
      </Button>

      <Button
        className='googleButton'
        size='medium'
        fullWidth
        sx={{ height: 44 }}
      >
        <MuiImage src='/assets/images/icons/google-1.svg' alt='facebook' />
        <Box fontSize='12px' ml={1}>
          Tiếp tục với Google
        </Box>
      </Button>
    </Fragment>
  );
};

export default SocialButtons;
