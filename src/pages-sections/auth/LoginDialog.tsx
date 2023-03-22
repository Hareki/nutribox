import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';

import Login from './Login';

import useLoginDialog from 'hooks/global-states/useLoginDialog';
import { useLoginForm } from 'hooks/useLoginForm';

const LoginDialog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { loginDialogState, setLoginDialogOpen } = useLoginDialog();

  const { checkingCredentials, handleFormSubmit, signInResponse, incorrect } =
    useLoginForm();

  useEffect(() => {
    console.log(signInResponse);
    if (signInResponse && signInResponse.ok) {
      setLoginDialogOpen(false);
    }
  }, [signInResponse, setLoginDialogOpen]);

  return (
    <Dialog
      scroll='body'
      open={loginDialogState.isOpen}
      fullWidth={isMobile}
      onClose={() => setLoginDialogOpen(false)}
      sx={{ zIndex: 9999 }}
    >
      <Login
        loading={checkingCredentials}
        handleFormSubmit={handleFormSubmit}
        incorrect={incorrect}
      />
    </Dialog>
  );
};

export default LoginDialog;
