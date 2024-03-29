import { Box, styled } from '@mui/material';

import { H2 } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import useWindowSize from 'hooks/useWindowSize';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(3),
  '& .headerHold': {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  [theme.breakpoints.up('md')]: {
    '& .sidenav': { display: 'none' },
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

// ==============================================================
type UserDashboardHeaderProps = {
  icon?: any;
  button?: any;
  title?: string;
  navigation?: any;
};
// ==============================================================

const UserDashboardHeader: React.FC<UserDashboardHeaderProps> = ({
  title,
  button,
  // navigation,
  ...props
}) => {
  const width = useWindowSize();
  const isTablet = width < 1025;

  return (
    <StyledBox>
      <FlexBox mt={2} className='headerHold' alignItems='center'>
        <FlexBox alignItems='center'>
          {props.icon && <props.icon color='primary' />}
          <H2 ml={1.5} my='0px' lineHeight='1' whiteSpace='pre'>
            {title}
          </H2>
        </FlexBox>

        {/* <Box className='sidenav'>
          <SideNav position='left' handle={<Menu fontSize='small' />}>
            {navigation}
          </SideNav>
        </Box> */}

        {/* {!isTablet && button} */}
        {!!button && <Box>{button}</Box>}
      </FlexBox>

      {/* {isTablet && !!button && <Box mt={2}>{button}</Box>} */}
    </StyledBox>
  );
};

export default UserDashboardHeader;
