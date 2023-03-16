/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, styled } from '@mui/material';
import clsx from 'clsx';
import { FC, ReactNode, useState } from 'react';

import { layoutConstant } from 'utils/constants';

const StyledContainer = styled(Container)<{ side_nav_bottom_offset: string }>(
  ({ theme, side_nav_bottom_offset }) => ({
    paddingTop: 24,
    display: 'flex',
    position: 'relative',
    '.sidenav': {
      top: 0,
      bottom: 0,
      position: 'relative',
      width: layoutConstant.grocerySidenavWidth,
      minWidth: layoutConstant.grocerySidenavWidth,
      // height: `calc(100vh - ${layoutConstant.headerHeight}px)`,
      height: `fit-content`,
      '& .MuiPaper-root': { borderRadius: 5 },
    },
    '.sticky': {
      position: 'sticky',
      top: layoutConstant.headerHeight,
      marginBottom: side_nav_bottom_offset,
    },

    '.pageContent': {
      left: 'unset',
      position: 'relative',
      marginLeft: '1.75rem',
      width: `calc(100% - 2rem - ${layoutConstant.grocerySidenavWidth}px)`,
    },

    '.pageContentShifted': { left: layoutConstant.grocerySidenavWidth },

    '.section1': { marginBottom: '3rem', marginTop: '1.75rem' },
    '@keyframes slideDown': {
      '0%': { opacity: 0, transform: 'translateY(0)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
    [theme.breakpoints.down('md')]: {
      '.sidenav': { display: 'none' },
      '.pageContent': {
        left: '0px !important',
        width: '100% !important',
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
      },
    },
  }),
);

// ================================================================
type SideNavContainerProps = {
  SideNav: any;
  children: ReactNode;
  sideNavBottomOffset: string;
};
// ================================================================

const SideNavContainer: FC<SideNavContainerProps> = (props) => {
  const { SideNav, children, sideNavBottomOffset } = props;

  const [isSidenavFixed, setIsSidenavFixed] = useState<boolean>(false);

  return (
    <StyledContainer side_nav_bottom_offset={sideNavBottomOffset}>
      <Box className={clsx({ sidenav: true, sticky: true })}>
        <SideNav />
      </Box>

      <Box
        className={clsx({
          pageContent: true,
          pageContentShifted: isSidenavFixed,
        })}
      >
        {children}
      </Box>
    </StyledContainer>
  );
};

export default SideNavContainer;
