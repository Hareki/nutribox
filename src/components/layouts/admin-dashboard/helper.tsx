import { Box } from '@mui/material';

import {
  ListLabel,
  BadgeValue,
  StyledText,
  BulletIcon,
  ExternalLink,
  NavItemButton,
  ListIconWrapper,
} from './LayoutStyledComponents';
import type { NavigationItem, SideBarRole } from './NavigationList';
import SidebarAccordion from './SidebarAccordion';

import type { EmployeeRole } from 'backend/enums/entities.enum';

const renderLevels = (
  data: Record<SideBarRole, NavigationItem[]>,
  role: EmployeeRole,
) => {
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
};
