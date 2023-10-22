import type { Theme } from '@mui/material';
import { Box, styled, useMediaQuery } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { Fragment, useEffect, useState } from 'react';

import SideBar from './SideBar';

import { FlexRowCenter } from 'components/flex-box';
import Toggle from 'components/icons/Toggle';
import { exclude } from 'theme/styledConfigs';

const bannedProps = ['compact'];

// styled components
const BodyWrapper = styled(Box, { shouldForwardProp: exclude(bannedProps) })<{
  compact: number;
}>(({ theme, compact }) => ({
  transition: 'margin-left 0.3s',
  marginLeft: compact ? '86px' : '280px',
  [theme.breakpoints.down('lg')]: { marginLeft: 0 },
}));

const InnerWrapper = styled(Box)(({ theme }) => ({
  transition: 'all 0.3s',
  [theme.breakpoints.up('lg')]: { maxWidth: 1200, margin: 'auto' },
  [theme.breakpoints.down('lg')]: { marginTop: '40px' },
  [theme.breakpoints.down(1550)]: { paddingLeft: '2rem', paddingRight: '2rem' },
}));

const ToggleWrapper = styled(FlexRowCenter)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  position: 'fixed',
  top: '30px',
  left: '30px',
  width: 40,
  height: 40,
  flexShrink: 0,
  cursor: 'pointer',
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[100],
  display: 'none',
  [theme.breakpoints.down('lg')]: { display: 'block' },
}));

// ======================================================
type Props = { children: ReactNode };
// ======================================================

const AdminDashboardLayout: FC<Props> = ({ children }) => {
  const [sidebarCompact, setSidebarCompact] = useState(0);
  const [showMobileSideBar, setShowMobileSideBar] = useState(0);
  const downLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const [menuOpen, setMenuOpen] = useState(false);

  // handle sidebar toggle for desktop device
  const handleCompactToggle = () =>
    setSidebarCompact((state) => (state ? 0 : 1));
  // handle sidebar toggle in mobile device
  const handleMobileDrawerToggle = () => {
    setShowMobileSideBar((state) => (state ? 0 : 1));
    setMenuOpen((state) => !state);
  };

  return (
    <Fragment>
      <SideBar
        sidebarCompact={!!sidebarCompact}
        showMobileSideBar={!!showMobileSideBar}
        setSidebarCompact={handleCompactToggle}
        setShowMobileSideBar={handleMobileDrawerToggle}
        isMobile={downLg}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <ToggleWrapper onClick={handleMobileDrawerToggle}>
        <Toggle />
      </ToggleWrapper>

      <BodyWrapper compact={sidebarCompact ? 1 : 0}>
        {/* <DashboardNavbar handleDrawerToggle={handleMobileDrawerToggle} /> */}
        <InnerWrapper>{children}</InnerWrapper>
      </BodyWrapper>
    </Fragment>
  );
};

export default AdminDashboardLayout;
