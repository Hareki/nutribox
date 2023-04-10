import { PersonOutline } from '@mui/icons-material';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { FC, MouseEvent } from 'react';
import React, { useState } from 'react';

import { H6, Small } from 'components/abstract/Typography';
import useLoginDialog from 'hooks/global-states/useLoginDialog';
import useSignOutDialog from 'hooks/useSignOutDialog';

const Divider = styled(Box)(({ theme }) => ({
  margin: '0.5rem 0',
  border: `1px dashed ${theme.palette.grey[200]}`,
}));

const getUserRoleName = (roleId: string) => {
  switch (roleId) {
    case 'ADMIN':
      return 'Quản trị viên';
    case 'CUSTOMER':
      return 'Khách hàng';
    case 'SUPPLIER':
      return 'Nhà cung cấp';
    default:
      return '';
  }
};

interface AccountMenuProps {}

const AccountMenu: FC<AccountMenuProps> = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const userFullName = session?.user?.fullName;
  const userRole = session?.user?.role;
  const userUrl = session?.user?.avatarUrl;
  const { palette } = useTheme();

  const { dialog: signOutDialog, dispatchConfirm } = useSignOutDialog();
  const { setLoginDialogOpen } = useLoginDialog();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => setAnchorEl(null);
  const handleClick = (event: MouseEvent) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
      return;
    }
    setLoginDialogOpen(true);
  };

  const isLoadingSession = status === 'loading';

  const iconStyles = {
    color: palette.grey[700],
  };
  return (
    <Box>
      <Box bgcolor='grey.200' borderRadius='50%'>
        <IconButton
          disabled={isLoadingSession}
          id='account-menu-button'
          sx={{ padding: isAuthenticated || isLoadingSession ? 0 : 1.25 }}
          // sx={{ padding: 0 }}
          aria-haspopup='true'
          onClick={handleClick}
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'account-menu' : undefined}
        >
          {isLoadingSession && <CircularProgress />}
          {isAuthenticated && (
            <Avatar
              alt={userFullName}
              src={userUrl}
              sx={{
                '& .MuiAvatar-img': {
                  objectFit: 'fill',
                },
              }}
            />
          )}

          {!isAuthenticated && !isLoadingSession && <PersonOutline />}
        </IconButton>
      </Box>

      <Menu
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        id='account-menu'
        anchorEl={anchorEl}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            boxShadow: 2,
            minWidth: 200,
            borderRadius: '8px',
            overflow: 'visible',
            border: '1px solid',
            borderColor: 'grey.200',
            '& .MuiMenuItem-root:hover': {
              backgroundColor: 'grey.200',
            },
            '&:before': {
              top: 0,
              right: 14,
              zIndex: 0,
              width: 10,
              height: 10,
              content: '""',
              display: 'block',
              position: 'absolute',
              borderTop: '1px solid',
              borderLeft: '1px solid',
              borderColor: 'grey.200',
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
            },
          },
        }}
      >
        <Box px={2} pt={1}>
          <H6>{userFullName}</H6>
          <Small color='grey.500'>{getUserRoleName(userRole)}</Small>
        </Box>

        <Divider />
        <Link href='/profile'>
          <MenuItem>
            <ListItemIcon>
              <PermIdentityIcon sx={iconStyles} />
            </ListItemIcon>
            Tài khoản của tôi
          </MenuItem>
        </Link>

        <Link href='/profile/order'>
          <MenuItem>
            <ListItemIcon>
              <DescriptionOutlinedIcon sx={iconStyles} />
            </ListItemIcon>
            Đơn hàng
          </MenuItem>
        </Link>

        {userRole === 'ADMIN' && (
          <div>
            <Divider />
            <Link href='/admin/dashboard'>
              <MenuItem>
                <ListItemIcon>
                  <ChromeReaderModeOutlinedIcon sx={iconStyles} />
                </ListItemIcon>
                Bảng điều khiển
              </MenuItem>
            </Link>
          </div>
        )}

        <Divider />
        <MenuItem
          onClick={() =>
            dispatchConfirm({
              type: 'open_dialog',
            })
          }
        >
          <ListItemIcon>
            <LogoutOutlinedIcon sx={iconStyles} />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
      {signOutDialog}
    </Box>
  );
};

export default AccountMenu;
