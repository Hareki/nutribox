import { Avatar, Box, Skeleton, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHoverDirty } from 'react-use';

import LayoutDrawer from '../LayoutDrawer';

import {
  ListLabel,
  StyledText,
  BulletIcon,
  NavWrapper,
  NavItemButton,
  SidebarWrapper,
  ChevronLeftIcon,
  ListIconWrapper,
  ExternalLink,
  BadgeValue,
} from './LayoutStyledComponents2';
import {
  navigations,
  type NavigationItem,
  type SideBarRole,
} from './NavigationList';
import SidebarAccordion from './SidebarAccordion';
import EmployeeMenu from './UserMenu';

import type { EmployeeRole } from 'backend/enums/entities.enum';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { FlexBetween, FlexBox, FlexRowCenter } from 'components/flex-box';
import Scrollbar from 'components/Scrollbar';
import useSignOutDialog from 'hooks/useSignOutDialog';
import { shortenUrl } from 'utils/middleware.helper';

// import useSignOutDialog from 'hooks/useSignOutDialog';

const TOP_HEADER_AREA = 100;

type SideBarProps = {
  sidebarCompact: boolean;
  showMobileSideBar: boolean;
  setSidebarCompact: () => void;
  setShowMobileSideBar: () => void;
  isMobile: boolean;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

const SideBar: FC<SideBarProps> = (props) => {
  const {
    sidebarCompact,
    showMobileSideBar,
    setShowMobileSideBar,
    setSidebarCompact,
    isMobile,
    menuOpen,
    setMenuOpen,
  } = props;

  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.employeeAccount.employee.role;
  const { dialog: signOutDialog, dispatchConfirm } =
    useSignOutDialog('employee');

  const sideBarRef = useRef<Element>(null);
  const isHovered = useHoverDirty(sideBarRef);

  const [minimized, setMinimized] = useState<boolean>(
    sidebarCompact && !isHovered && !menuOpen,
  );

  useEffect(() => {
    setMinimized(sidebarCompact && !isHovered && !menuOpen);
  }, [sidebarCompact, isHovered, menuOpen]);

  const activeRoute = useCallback(
    (rawPath: string) => {
      const path = shortenUrl(rawPath);

      return router.pathname.endsWith(`${path}/[id]`) ||
        router.pathname.endsWith(`${path}/new`) ||
        router.pathname.endsWith(path) ||
        router.asPath.endsWith(path)
        ? true
        : false;
    },
    [router.pathname, router.asPath],
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
            <ListLabel key={index} compact={minimized}>
              {item.name}
            </ListLabel>
          );

        if (item.children) {
          return (
            <SidebarAccordion
              key={index}
              item={item}
              sidebarCompact={minimized}
            >
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
              <NavItemButton key={item.name} name='child' active={false}>
                {item.icon ? (
                  <ListIconWrapper>
                    <item.icon />
                  </ListIconWrapper>
                ) : (
                  <span className='item-icon icon-text'>{item.iconText}</span>
                )}

                <StyledText compact={minimized}>{item.name}</StyledText>

                {/* <Box mx="auto" /> */}

                {item.badge && (
                  <BadgeValue compact={minimized}>
                    {item.badge.value}
                  </BadgeValue>
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

                <StyledText compact={minimized}>{item.name}</StyledText>

                {/* <Box mx="auto" /> */}

                {item.badge && (
                  <BadgeValue compact={minimized}>
                    {item.badge.value}
                  </BadgeValue>
                )}
              </NavItemButton>
              {item.type === 'signOut' && signOutDialog}
            </Box>
          );
        }
      });
    },
    [minimized, activeRoute, dispatchConfirm, handleNavigation, signOutDialog],
  );

  const theme = useTheme();
  const content = (
    <>
      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: 'hidden',
          maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
        }}
      >
        <NavWrapper compact={sidebarCompact}>
          {!role ? (
            <FlexRowCenter flexDirection='column' gap={2}>
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  sx={{ bgcolor: theme.palette.primary[100] }}
                  variant='rounded'
                  width={240}
                  height={40}
                />
              ))}
            </FlexRowCenter>
          ) : (
            renderLevels(navigations, role)
          )}
        </NavWrapper>
      </Scrollbar>
    </>
  );

  if (isMobile) {
    return (
      <LayoutDrawer
        open={showMobileSideBar ? true : false}
        onClose={() => {
          console.log('run');
          setShowMobileSideBar();
        }}
      >
        <Box pt={2} px={2} maxHeight={TOP_HEADER_AREA}>
          <img
            alt='Logo'
            height={45}
            width='auto'
            src='/assets/images/logo-white.svg'
            style={{ marginLeft: 8 }}
          />
        </Box>
        <EmployeeMenu
          minimized={minimized}
          setMenuOpen={setMenuOpen}
          // setLogOutDialogVisible={setLogOutDialogVisible}
          dispatchConfirm={dispatchConfirm}
        />

        {content}
      </LayoutDrawer>
    );
  }

  return (
    <SidebarWrapper compact={minimized} ref={sideBarRef}>
      <FlexBetween
        pt={2}
        px={2}
        maxHeight={TOP_HEADER_AREA}
        justifyContent={minimized ? 'center' : 'space-between'}
      >
        <Avatar
          src={
            minimized
              ? '/assets/images/logo-sm.svg'
              : '/assets/images/logo-white.svg'
          }
          sx={{
            borderRadius: 0,
            width: 'auto',
            height: 45,
            marginLeft: minimized ? 0 : 1,
          }}
        />

        <ChevronLeftIcon
          color='disabled'
          compact={minimized}
          onClick={setSidebarCompact}
          sideBarCompact={sidebarCompact}
        />
      </FlexBetween>

      <EmployeeMenu
        minimized={minimized}
        setMenuOpen={setMenuOpen}
        // setLogOutDialogVisible={setLogOutDialogVisible}
        dispatchConfirm={dispatchConfirm}
      />

      {content}
    </SidebarWrapper>
  );
};

export default SideBar;
