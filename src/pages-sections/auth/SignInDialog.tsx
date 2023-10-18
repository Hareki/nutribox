import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';

import SignIn from './SignIn';

import useLoginDialog from 'hooks/global-states/useLoginDialog';
import { useLoginForm } from 'hooks/useLoginForm';

const SignInDialog = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { loginDialogState, setLoginDialogOpen } = useLoginDialog();

  const {
    checkingCredentials,
    handleFormSubmit,
    signInResponse,
    errorMessage,
  } = useLoginForm();

  useEffect(() => {
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
      <SignIn
        loading={checkingCredentials}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
      />
    </Dialog>
  );
};

export default SignInDialog;
