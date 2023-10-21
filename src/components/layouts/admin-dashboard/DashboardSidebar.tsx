import type { Theme } from '@mui/material';
import { Avatar, Box, useMediaQuery } from '@mui/material';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import LayoutDrawer from '../LayoutDrawer';

import {
  ListLabel,
  BadgeValue,
  StyledText,
  BulletIcon,
  NavWrapper,
  ExternalLink,
  NavItemButton,
  SidebarWrapper,
  ChevronLeftIcon,
  ListIconWrapper,
} from './LayoutStyledComponents';
import type { NavigationItem, SideBarRole } from './NavigationList';
import { navigations } from './NavigationList';
import SidebarAccordion from './SidebarAccordion';

import type { EmployeeRole } from 'backend/enums/entities.enum';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { FlexBetween } from 'components/flex-box';
import Scrollbar from 'components/Scrollbar';
import useSignOutDialog from 'hooks/useSignOutDialog';
import { shortenUrl } from 'utils/middleware.helper';

const TOP_HEADER_AREA = 70;

// -----------------------------------------------------------------------------
type DashboardSidebarProps = {
  sidebarCompact: any;
  showMobileSideBar: any;
  setSidebarCompact: () => void;
  setShowMobileSideBar: () => void;
};
// -----------------------------------------------------------------------------

const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const {
    sidebarCompact,
    showMobileSideBar,
    setShowMobileSideBar,
    setSidebarCompact,
  } = props;

  const { data: session } = useSession();
  const role = session?.employeeAccount.employee.role;

  const router = useRouter();
  const { dialog: signOutDialog, dispatchConfirm } = useSignOutDialog();

  const [onHover, setOnHover] = useState(false);
  const downLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // side hover when side bar is compacted
  const COMPACT = sidebarCompact && !onHover ? 1 : 0;
  // handle active current pag
  // FIXME shouldn't be hardcoded the [id] path
  const activeRoute = useCallback(
    (rawPath: string) => {
      const path = shortenUrl(rawPath);
      console.log('router.pathname', router.pathname);
      console.log('path', path);

      return router.pathname.endsWith(`${path}/[id]`) ||
        router.pathname.endsWith(`${path}/create`) ||
        router.pathname.endsWith(path)
        ? 1
        : 0;
    },
    [router.pathname],
  );

  // handle navigate to another route and close sidebar drawer in mobile device
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
      setShowMobileSideBar();
    },
    [router, setShowMobileSideBar],
  );

  const renderLevels = useCallback(
    (data: Record<SideBarRole, NavigationItem[]>, role: EmployeeRole) => {
      return data[role.toString()].map((item: any, index: any) => {
        if (item.type === 'label')
          return (
            <ListLabel key={index} compact={COMPACT}>
              {item.name}
            </ListLabel>
          );

        if (item.children) {
          return (
            <SidebarAccordion key={index} item={item} sidebarCompact={COMPACT}>
              {renderLevels(item.children, role)}
            </SidebarAccordion>
          );
        } else if (item.type === 'extLink') {
          return (
            <ExternalLink
              key={index}
              href={item.path}
              rel='noopener noreferrer'
              target='_blank'
            >
              <NavItemButton key={item.name} name='child' active={0}>
                {item.icon ? (
                  <ListIconWrapper>
                    <item.icon />
                  </ListIconWrapper>
                ) : (
                  <span className='item-icon icon-text'>{item.iconText}</span>
                )}

                <StyledText compact={COMPACT}>{item.name}</StyledText>

                {/* <Box mx="auto" /> */}

                {item.badge && (
                  <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
                )}
              </NavItemButton>
            </ExternalLink>
          );
        } else {
          return (
            <Box key={index}>
              <NavItemButton
                key={item.name}
                className='navItem'
                active={activeRoute(item.path) && item.type !== 'signOut'}
                onClick={() => {
                  if (item.type === 'signOut') {
                    dispatchConfirm({ type: 'open_dialog' });
                  } else {
                    handleNavigation(item.path);
                  }
                }}
              >
                {item?.icon ? (
                  <ListIconWrapper>
                    <item.icon />
                  </ListIconWrapper>
                ) : (
                  <BulletIcon active={activeRoute(item.path)} />
                )}

                <StyledText compact={COMPACT}>{item.name}</StyledText>

                {/* <Box mx="auto" /> */}

                {item.badge && (
                  <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
                )}
              </NavItemButton>
              {item.type === 'signOut' && signOutDialog}
            </Box>
          );
        }
      });
    },
    [COMPACT, activeRoute, dispatchConfirm, handleNavigation, signOutDialog],
  );

  const content = (
    <Scrollbar
      autoHide
      clickOnTrack={false}
      sx={{
        overflowX: 'hidden',
        maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
      }}
    >
      <NavWrapper compact={sidebarCompact}>
        {!role ? <CircularProgressBlock /> : renderLevels(navigations, role)}
      </NavWrapper>
    </Scrollbar>
  );

  if (downLg) {
    return (
      <LayoutDrawer
        open={showMobileSideBar ? true : false}
        onClose={setShowMobileSideBar}
      >
        <Box p={2} maxHeight={TOP_HEADER_AREA}>
          <Image
            alt='Logo'
            width={105}
            height={50}
            src='/assets/images/logo-white.svg'
            style={{ marginLeft: 8 }}
          />
        </Box>

        {content}
      </LayoutDrawer>
    );
  }

  return (
    <SidebarWrapper
      compact={sidebarCompact ? 1 : 0}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => sidebarCompact && setOnHover(false)}
    >
      <FlexBetween
        p={2}
        maxHeight={TOP_HEADER_AREA}
        justifyContent={COMPACT ? 'center' : 'space-between'}
      >
        <Avatar
          src={
            COMPACT
              ? '/assets/images/logo-sm.svg'
              : '/assets/images/logo-white.svg'
          }
          sx={{ borderRadius: 0, width: 'auto', marginLeft: COMPACT ? 0 : 1 }}
        />

        <ChevronLeftIcon
          color='disabled'
          compact={COMPACT}
          onClick={setSidebarCompact}
          sidebarcompact={sidebarCompact ? 1 : 0}
        />
      </FlexBetween>

      {content}
    </SidebarWrapper>
  );
};

export default DashboardSidebar;
