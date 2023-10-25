import { styled } from '@mui/material';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import type { FC } from 'react';
// styled component
const Provider = styled(NotistackProvider)(({ theme }) => ({
  '&.SnackbarItem-variantSuccess': {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  '.SnackbarItem-anchorOriginTopRight &': {
    zIndex: theme.zIndex.snackbar,
    translate: '0px 75px',
  },
  '&.SnackbarContent-root.SnackbarItem-contentRoot': {
    boxShadow: theme.shadows[2],
    color: theme.palette.common.black,
    background: theme.palette.common.white,
    fontFamily: theme.typography.fontFamily,
  },

  '&.SnackbarItem-variantSuccess .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
  '&.SnackbarItem-variantError .MuiSvgIcon-root': {
    color: theme.palette.error.main,
  },
}));

type Props = { children: any };
const SnackbarProvider: FC<Props> = ({ children }) => {
  return (
    <Provider
      maxSnack={4}
      autoHideDuration={3_000}
      classes={{
        anchorOriginTopRight: 'SnackbarItem-anchorOriginTopRight',
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {children}
    </Provider>
  );
};

export default SnackbarProvider;
