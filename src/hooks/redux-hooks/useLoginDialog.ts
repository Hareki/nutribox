import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch, RootState } from 'store';
import { setLoginDialogOpen as setLoginDialogVisible } from 'store/slices/loginDialogSlice';

const useLoginDialog = () => {
  const loginDialogState = useSelector((state: RootState) => state.loginDialog);
  const dispatch = useDispatch<AppDispatch>();

  const setLoginDialogOpen = (isOpen: boolean) => {
    dispatch(setLoginDialogVisible(isOpen));
  };

  return {
    loginDialogState,
    setLoginDialogOpen,
  };
};

export default useLoginDialog;
