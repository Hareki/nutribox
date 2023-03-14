import {
  Clear,
  ContentCopy,
  ContentCut,
  ContentPaste,
  PersonOutline,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Dialog,
  Drawer,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FC, Fragment, ReactElement, useEffect, useState } from 'react';

import Image from 'components/BazaarImage';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Icon from 'components/icons';
import ShoppingBagOutlined from 'components/icons/ShoppingBagOutlined';
import CartDrawer from 'components/MiniCart';
import MobileMenu from 'components/navbar/MobileMenu';
import { Paragraph } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { useLoginForm } from 'hooks/useLoginForm';
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
  className?: string;
  searchInput: ReactElement;
};
// ==============================================================

const Header: FC<HeaderProps> = ({ className, searchInput }) => {
  const theme = useTheme();
  const { state } = useAppContext();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  const toggleCartDrawer = () => setSidenavOpen(!sidenavOpen);
  const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);
  const togglePopover = () => setUserMenuOpen(!userMenuOpen);

  const { checkingCredentials, handleFormSubmit, signInResponse, incorrect } =
    useLoginForm();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(signInResponse);
    if (signInResponse && signInResponse.ok) {
      setDialogOpen(false);
    }
  }, [signInResponse]);

  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const UserMenu = (
    <Menu
      open={isAuthenticated && userMenuOpen}
      anchorEl={isAuthenticated && document.getElementById('user-button')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        zIndex: 9999,
      }}
    >
      <MenuItem>
        <ListItemIcon>
          <ContentCut fontSize='small' />
        </ListItemIcon>
        <ListItemText>Cut</ListItemText>
      </MenuItem>

      <MenuItem>
        <ListItemIcon>
          <ContentCopy fontSize='small' />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
      </MenuItem>

      <MenuItem>
        <ListItemIcon>
          <ContentPaste fontSize='small' />
        </ListItemIcon>
        <ListItemText>Paste</ListItemText>
      </MenuItem>
    </Menu>
  );

  // Login Dialog and Cart Drawer
  const DialogAndDrawer = (
    <Fragment>
      <Dialog
        scroll='body'
        open={dialogOpen}
        fullWidth={isMobile}
        onClose={() => setDialogOpen(false)}
        sx={{ zIndex: 9999 }}
      >
        <Login
          loading={checkingCredentials}
          handleFormSubmit={handleFormSubmit}
          incorrect={incorrect}
        />
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

              <Box component={IconButton} onClick={() => setDialogOpen(true)}>
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
            id='user-button'
            component={IconButton}
            p={isAuthenticated ? 0 : 1.25}
            bgcolor='grey.200'
            onClick={() => {
              if (isAuthenticated) {
                togglePopover();
              } else {
                setDialogOpen(true);
              }
            }}
          >
            {isAuthenticated ? (
              <>
                <Avatar alt={user.fullName} src={user.avatarUrl} />
                {UserMenu}
              </>
            ) : (
              <PersonOutline />
            )}
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
        {DialogAndDrawer}
      </StyledContainer>
    </HeaderWrapper>
  );
};

export default Header;
