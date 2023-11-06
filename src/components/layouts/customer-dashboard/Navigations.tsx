import { Person, Place } from '@mui/icons-material';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import { Card, styled, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';
import { Fragment } from 'react';

import menuCountCaller from 'api-callers/profile/menu-count';
import { FlexBox } from 'components/flex-box';
import type { NavLinkProps } from 'components/nav-link/NavLink';
import NavLink from 'components/nav-link/NavLink';
import {
  ADDRESSES_ROUTE,
  ORDERS_ROUTE,
  PROFILE_ROUTE,
} from 'constants/routes.ui.constant';
import { shortenUrl } from 'utils/middleware.helper';

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
  const { data: session, status } = useSession();

  const { data: count } = useQuery({
    queryKey: ['count', session?.account?.customer.id],
    queryFn: () => menuCountCaller.countAddressAndOrder(),
    enabled: status === 'authenticated' && !!session,
  });

  return (
    <MainContainer>
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p='26px 30px 1rem' color='grey.600' fontSize='12px'>
            {item.title}
          </Typography>

          {item.list.map((item) => {
            // console.log('item.href: ', item.href);
            return (
              <StyledNavLink
                href={item.href}
                key={item.title}
                // FIXME shouldn't be hard coded the [id] path
                isCurrentPath={
                  pathname.endsWith(`${shortenUrl(item.href)}/[id]`) ||
                  pathname.endsWith(`${shortenUrl(item.href)}`)
                }
              >
                <FlexBox alignItems='center' gap={1}>
                  <item.icon
                    color='inherit'
                    fontSize='small'
                    className='nav-icon'
                  />
                  <span className='nav-text'>{item.title}</span>
                </FlexBox>

                <span className='nav-text'>
                  {item.title === 'Địa chỉ' && count?.addressCount}
                  {item.title === 'Đơn hàng' && count?.orderCount}
                </span>
              </StyledNavLink>
            );
          })}
        </Fragment>
      ))}
    </MainContainer>
  );
};

const linkList = [
  {
    title: 'QUẢN LÝ TÀI KHOẢN',
    list: [
      { href: PROFILE_ROUTE, title: 'Hồ sơ của tôi', icon: Person },
      { href: ADDRESSES_ROUTE, title: 'Địa chỉ', icon: Place },
      {
        href: ORDERS_ROUTE,
        title: 'Đơn hàng',
        icon: ShoppingBag,
      },
    ],
  },
];

export default Navigations;
