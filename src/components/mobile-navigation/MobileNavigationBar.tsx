import { Badge, Box } from '@mui/material';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import { useEffect, useState } from 'react';

import {
  iconStyle,
  StyledBox,
  StyledDrawer,
  StyledNavLink,
  Wrapper,
} from './styles';

import CategoryOutlined from 'components/icons/CategoryOutline';
import Home from 'components/icons/Home';
import ShoppingBagOutlined from 'components/icons/ShoppingBagOutlined';
import User2 from 'components/icons/User2';
import useCart from 'hooks/global-states/useCart';
import useCartDrawer from 'hooks/global-states/useCartDrawer';
import useWindowSize from 'hooks/useWindowSize';
import { LayoutConstant } from 'utils/constants';

// ===================================================
type Props = { children?: ReactNode };
// ===================================================

/**
 * Difference between MobileNaviagationBar and MobileNaviagationBar2
 * 1. In the MobileNaviagationBar we doesn't use conditinally render
 * 2. In the list array if doesn't exists href property then open category menus sidebar drawer in MobileNaviagationBar2
 */

const MobileNavigationBar: FC<Props> = ({ children }) => {
  const width = useWindowSize();
  const { cartState } = useCart();
  const [childrenDrawerOpen, setChildrenDrawerOpen] = useState(false);

  const { mobileNavHeight, topbarHeight } = LayoutConstant;
  const total = mobileNavHeight + topbarHeight;
  const [totalHeight, setTotalHeight] = useState<number>(total);

  const { toggleCartDrawer } = useCartDrawer();

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 30) setTotalHeight(mobileNavHeight);
      else setTotalHeight(total);
    };

    window.addEventListener('scroll', listener);
    return () => window.removeEventListener('scroll', listener);
  }, [mobileNavHeight, total]);

  return width <= 900 ? (
    <Box position='relative' display='flex' flexDirection='column'>
      <StyledDrawer
        open={childrenDrawerOpen}
        anchor='left'
        totalheight={totalHeight}
        onClose={() => setChildrenDrawerOpen(false)}
      >
        {children}
      </StyledDrawer>

      <Wrapper>
        {list.map((item) => {
          if (item.href) {
            return (
              <StyledNavLink href={item.href} key={item.title}>
                {item.title === 'Cart' && (
                  <Badge badgeContent={cartState.cart.length} color='primary'>
                    <item.icon fontSize='small' sx={iconStyle} />
                  </Badge>
                )}

                {item.title !== 'Cart' && (
                  <item.icon sx={iconStyle} fontSize='small' />
                )}
                {item.title}
              </StyledNavLink>
            );
          } else {
            return (
              <Fragment key={item.title}>
                {item.title === 'Category' && (
                  <StyledBox
                    onClick={() => setChildrenDrawerOpen((prev) => !prev)}
                  >
                    <item.icon sx={iconStyle} fontSize='small' />

                    {item.title}
                  </StyledBox>
                )}
                {item.title === 'Cart' && (
                  <StyledBox onClick={() => toggleCartDrawer()}>
                    <Badge badgeContent={cartState.cart.length} color='primary'>
                      <item.icon fontSize='small' sx={iconStyle} />
                    </Badge>

                    {item.title}
                  </StyledBox>
                )}
              </Fragment>
            );
          }
        })}
      </Wrapper>
    </Box>
  ) : null;
};

const list = [
  { title: 'Home', icon: Home, href: '/' },
  { title: 'Category', icon: CategoryOutlined },
  { title: 'Cart', icon: ShoppingBagOutlined },
  { title: 'Account', icon: User2, href: '/profile' },
];

export default MobileNavigationBar;
