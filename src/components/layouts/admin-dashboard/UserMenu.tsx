import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PersonOutline from '@mui/icons-material/PersonOutline';
import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useState, type FC } from 'react';

import { StyledUserName } from './LayoutStyledComponents2';

import { H4, H6, Paragraph, Small } from 'components/abstract/Typography';
import type { ConfirmDialogAction } from 'components/dialog/confirm-dialog/reducer';
import { FlexRowCenter } from 'components/flex-box';
import { PROFILE_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { getAvatarUrl, getFullName } from 'helpers/account.helper';
import { getUserRoleName } from 'helpers/order.helper';

type UserMenuProps = {
  minimized: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  // setLogOutDialogVisible: Dispatch<SetStateAction<boolean>>;
  dispatchConfirm: Dispatch<ConfirmDialogAction>;
};

const EmployeeMenu: FC<UserMenuProps> = ({
  minimized,
  setMenuOpen,
  dispatchConfirm,
}) => {
  const { data: session, status } = useSession();
  const employee = session?.employeeAccount.employee;

  const isAuthenticated = status === 'authenticated';
  const isLoadingSession = status === 'loading';

  // const isAuthenticated = false;
  // const isLoadingSession = true;

  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isAuthenticated) {
      setMenuOpen(true);
      setAnchorEl(event.currentTarget);
      return;
    }
  };

  const theme = useTheme();
  const avatarSize = 50;

  return (
    <>
      <FlexRowCenter flexDirection='column' my={5} gap={1.5}>
        <IconButton
          disabled={isLoadingSession}
          id='account-menu-button'
          sx={{
            padding: isAuthenticated || isLoadingSession ? 0 : 1.25,
            backgroundColor: theme.palette.grey[100],
          }}
          onClick={handleClick}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'account-menu' : undefined}
        >
          {isLoadingSession && (
            <Skeleton
              sx={{ bgcolor: theme.palette.primary[100] }}
              variant='circular'
              width={50}
              height={50}
            />
          )}
          {isAuthenticated && (
            <Avatar
              alt={getFullName(employee)}
              src={getAvatarUrl(employee)}
              sx={{
                '& .MuiAvatar-img': {
                  objectFit: 'fill',
                },
                width: avatarSize,
                height: avatarSize,
              }}
            />
          )}

          {!isAuthenticated && !isLoadingSession && (
            <IconButton
              disabled
              sx={{
                padding: 1.25,
              }}
            >
              <PersonOutline />
            </IconButton>
          )}
        </IconButton>

        <StyledUserName compact={minimized}>
          {isLoadingSession ? (
            <Skeleton
              sx={{ bgcolor: theme.palette.primary[100] }}
              variant='rounded'
              width={180}
              height={50}
            />
          ) : (
            <>
              <H4>{getFullName(employee)}</H4>
              <Paragraph fontSize={13} color={theme.palette.grey[400]}>
                {getUserRoleName(employee?.role)}
              </Paragraph>
            </>
          )}
        </StyledUserName>
      </FlexRowCenter>

      <Menu
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        id='account-menu'
        anchorEl={anchorEl as Element}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <FlexRowCenter flexDirection='column' pb={1}>
          <H6>{getFullName(employee)}</H6>
          <Small color='grey.500'>{getUserRoleName(employee?.role)}</Small>
        </FlexRowCenter>
        <Divider />

        <Link href={PROFILE_STAFF_ROUTE}>
          <MenuItem>
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            Tài khoản của tôi
          </MenuItem>
        </Link>
        <Divider />

        <MenuItem onClick={() => dispatchConfirm({ type: 'open_dialog' })}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default EmployeeMenu;
