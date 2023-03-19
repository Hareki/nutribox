import { Person, Place } from '@mui/icons-material';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import { Card, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment } from 'react';

import { FlexBox } from 'components/flex-box';
import type { NavLinkProps } from 'components/nav-link/NavLink';
import NavLink from 'components/nav-link/NavLink';

// custom styled components
const MainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: '1.5rem',
  [theme.breakpoints.down('md')]: {
    boxShadow: 'none',
    overflowY: 'auto',
    height: 'calc(100vh - 64px)',
  },
}));

type StyledNavLinkProps = { isCurrentPath: boolean };

const StyledNavLink = styled<FC<StyledNavLinkProps & NavLinkProps>>(
  ({ children, isCurrentPath, ...rest }) => (
    <NavLink {...rest}>{children}</NavLink>
  ),
)<StyledNavLinkProps>(({ theme, isCurrentPath }) => ({
  display: 'flex',
  alignItems: 'center',
  borderLeft: '4px solid',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  marginBottom: '1.25rem',
  justifyContent: 'space-between',
  borderColor: isCurrentPath ? theme.palette.primary.main : 'transparent',
  '& .nav-icon, & .nav-text': {
    color: isCurrentPath ? theme.palette.primary.main : theme.palette.grey[600],
  },
  '&:hover': {
    borderColor: theme.palette.primary.main,
    '& .nav-icon, & .nav-text': { color: theme.palette.primary.main },
  },
}));

const Navigations = () => {
  const { pathname } = useRouter();
  console.log('file: Navigations.tsx:48 - Navigations - pathname:', pathname);

  return (
    <MainContainer>
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p='26px 30px 1rem' color='grey.600' fontSize='12px'>
            {item.title}
          </Typography>

          {item.list.map((item) => (
            <StyledNavLink
              href={item.href}
              key={item.title}
              isCurrentPath={pathname === item.href}
            >
              <FlexBox alignItems='center' gap={1}>
                <item.icon
                  color='inherit'
                  fontSize='small'
                  className='nav-icon'
                />
                <span className='nav-text'>{item.title}</span>
              </FlexBox>

              <span>{item.count}</span>
            </StyledNavLink>
          ))}
        </Fragment>
      ))}
    </MainContainer>
  );
};

const linkList = [
  {
    title: 'QUẢN LÝ TÀI KHOẢN',
    list: [
      { href: '/profile', title: 'Hồ sơ của tôi', icon: Person },
      { href: '/profile/address', title: 'Địa chỉ', icon: Place, count: 16 },
      {
        href: '/profile/orders',
        title: 'Đơn hàng',
        icon: ShoppingBag,
        count: 5,
      },
    ],
  },
];

export default Navigations;
