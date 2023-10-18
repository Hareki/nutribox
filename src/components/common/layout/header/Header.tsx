import { Clear, Menu } from '@mui/icons-material';
import { Badge, Box, Drawer, styled } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import type { FC, ReactElement } from 'react';
import { Fragment, useState } from 'react';

import { Paragraph } from 'components/abstract/Typography';
import CartDrawer from 'components/cart-drawer/CartDrawer';
import Image from 'components/common/input/MuiImage';
import CustomerUserMenu from 'components/CustomerUserMenu';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Icon from 'components/icons';
import ShoppingBagOutlined from 'components/icons/ShoppingBagOutlined';
import Navigations from 'components/layouts/customer-dashboard/Navigations';
import SideNav from 'components/side-nav/SideNav';
import useCart from 'hooks/global-states/useCart';
import useCartDrawer from 'hooks/global-states/useCartDrawer';
import { LayoutConstant } from 'utils/constants';

// styled component
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: 'sticky',
  height: LayoutConstant.headerHeight,
  transition: 'height 250ms ease-in-out',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    height: LayoutConstant.mobileHeaderHeight,
  },
}));

const StyledContainer = styled(Container)({
  gap: 2,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// ==============================================================
type HeaderProps = {
  className?: string;
  searchInput: ReactElement;
};
// ==============================================================

const Header: FC<HeaderProps> = ({ className, searchInput }) => {
  const theme = useTheme();
  const router = useRouter();
  const { cartItems } = useCart();

  const { cartDrawerState, toggleCartDrawer } = useCartDrawer();
  // const { setLoginDialogOpen } = useLoginDialog();
  // const [sidenavOpen, setSidenavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  // const toggleCartDrawer = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);
  const togglePopover = () => {
    console.log('toggle');
    setUserMenuOpen(!userMenuOpen);
  };

  const { data: session, status } = useSession();
  // console.log('file: Header.tsx:87 - session:', session);
  const isCheckingOut = router.pathname === '/checkout';
  const isInProfile = router.pathname.startsWith('/profile');

  const user = session?.user;

  // Login Dialog and Cart Drawer
  const DialogAndDrawer = (
    <Fragment>
      <Drawer
        open={cartDrawerState.isOpen}
        anchor='right'
        onClose={toggleCartDrawer}
        sx={{ zIndex: 9999 }}
      >
        {/* MiniCart */}
        <CartDrawer toggleCartDrawer={toggleCartDrawer} />
      </Drawer>
    </Fragment>
  );

  // For smaller device
  if (downMd) {
    const ICON_STYLE = { color: 'grey.600', fontSize: 20 };

    return (
      <HeaderWrapper className={clsx(className)}>
        <StyledContainer>
          <FlexBetween width='100%'>
            {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
            {isInProfile && (
              <Box flex={1}>
                {/* <MobileMenu /> */}
                <SideNav position='left' handle={<Menu fontSize='small' />}>
                  <Navigations />
                </SideNav>
              </Box>
            )}

            {/* MIDDLE CONTENT - LOGO */}
            <Link href='/'>
              <Image height={44} src='/assets/images/logo-sm.svg' alt='logo' />
            </Link>

            {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
            <FlexBox justifyContent='end' flex={1} gap={2}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              <Box>
                <CustomerUserMenu />
              </Box>

              <Box component={IconButton} onClick={toggleCartDrawer}>
                <Badge badgeContent={cartItems.length} color='primary'>
                  <Icon.CartBag sx={ICON_STYLE} />
                </Badge>
              </Box>
            </FlexBox>
          </FlexBetween>

          {/* SEARCH FORM DRAWER */}
          <Drawer
            open={searchBarOpen}
            anchor='top'
            onClose={toggleSearchBar}
            sx={{ zIndex: 9999 }}
          >
            <Box sx={{ width: 'auto', padding: 2, height: '100vh' }}>
              <FlexBetween mb={1}>
                <Paragraph>Tìm kiếm sản phẩm</Paragraph>

                <IconButton onClick={toggleSearchBar}>
                  <Clear />
                </IconButton>
              </FlexBetween>

              {/* CATEGORY BASED SEARCH FORM */}
              {searchInput}
            </Box>
          </Drawer>

          {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
          {DialogAndDrawer}
        </StyledContainer>
      </HeaderWrapper>
    );
  }

  return (
    <HeaderWrapper className={clsx(className)}>
      <StyledContainer>
        {/* LEFT CONTENT - LOGO AND CATEGORY */}
        <FlexBox mr={2} minWidth='170px' alignItems='center'>
          <Link href='/'>
            <Image height={44} src='/assets/images/logo.svg' alt='logo' />
          </Link>
        </FlexBox>

        {/* SEARCH FORM */}
        <FlexBox justifyContent='center' flex='1 1 0'>
          {searchInput}
        </FlexBox>

        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems='center'>
          <Box>
            <CustomerUserMenu />
          </Box>

          {!isCheckingOut && (
            <Badge badgeContent={cartItems.length} color='primary'>
              <Box
                p={1.25}
                bgcolor='grey.200'
                component={IconButton}
                onClick={toggleCartDrawer}
              >
                <ShoppingBagOutlined />
              </Box>
            </Badge>
          )}
        </FlexBox>

        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DialogAndDrawer}
      </StyledContainer>
    </HeaderWrapper>
  );
};

export default Header;
