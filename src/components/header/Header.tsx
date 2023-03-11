import { Clear, PersonOutline } from '@mui/icons-material';
import { Badge, Box, Dialog, Drawer, styled } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, Fragment, ReactElement, useState } from 'react';

import Image from 'components/BazaarImage';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Icon from 'components/icons';
import ShoppingBagOutlined from 'components/icons/ShoppingBagOutlined';
import CartDrawer from 'components/MiniCart';
import MobileMenu from 'components/navbar/MobileMenu';
import { Paragraph } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import Login from 'pages-sections/sessions/Login';
import { layoutConstant } from 'utils/constants';

// styled component
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: 'relative',
  height: layoutConstant.headerHeight,
  transition: 'height 250ms ease-in-out',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    height: layoutConstant.mobileHeaderHeight,
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
  isFixed?: boolean;
  className?: string;
  searchInput: ReactElement;
};
// ==============================================================

const Header: FC<HeaderProps> = ({ isFixed, className, searchInput }) => {
  const theme = useTheme();
  const { state } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleCartDrawer = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);

  // Login Dialog and Cart Drawer
  const DIALOG_DRAWER = (
    <Fragment>
      <Dialog
        scroll='body'
        open={dialogOpen}
        fullWidth={isMobile}
        onClose={toggleDialog}
        sx={{ zIndex: 9999 }}
      >
        <Login />
      </Dialog>

      <Drawer
        open={sidenavOpen}
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
            <Box flex={1}>
              <MobileMenu />
            </Box>

            {/* MIDDLE CONTENT - LOGO */}
            <Link href='/'>
              <Image
                height={44}
                src='/assets/images/bazaar-black-sm.svg'
                alt='logo'
              />
            </Link>

            {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
            <FlexBox justifyContent='end' flex={1}>
              <Box component={IconButton} onClick={toggleSearchBar}>
                <Icon.Search sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleDialog}>
                <Icon.User sx={ICON_STYLE} />
              </Box>

              <Box component={IconButton} onClick={toggleCartDrawer}>
                <Badge badgeContent={state.cart.length} color='primary'>
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
                <Paragraph>Search to Bazaar</Paragraph>

                <IconButton onClick={toggleSearchBar}>
                  <Clear />
                </IconButton>
              </FlexBetween>

              {/* CATEGORY BASED SEARCH FORM */}
              {searchInput}
            </Box>
          </Drawer>

          {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
          {DIALOG_DRAWER}
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
            <Image height={44} src='/assets/images/logo2.svg' alt='logo' />
          </Link>
        </FlexBox>

        {/* SEARCH FORM */}
        <FlexBox justifyContent='center' flex='1 1 0'>
          {searchInput}
        </FlexBox>

        {/* LOGIN AND CART BUTTON */}
        <FlexBox gap={1.5} alignItems='center'>
          <Box
            component={IconButton}
            p={1.25}
            bgcolor='grey.200'
            onClick={toggleDialog}
          >
            <PersonOutline />
          </Box>

          <Badge badgeContent={state.cart.length} color='primary'>
            <Box
              p={1.25}
              bgcolor='grey.200'
              component={IconButton}
              onClick={toggleCartDrawer}
            >
              <ShoppingBagOutlined />
            </Box>
          </Badge>
        </FlexBox>

        {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
        {DIALOG_DRAWER}
      </StyledContainer>
    </HeaderWrapper>
  );
};

export default Header;
