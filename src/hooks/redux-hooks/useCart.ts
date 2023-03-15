import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';

import { CartItem, changeCartAmount } from '../../store/slices/cartSlice';

import useLoginDialog from './useLoginDialog';

import { AppDispatch, RootState } from 'store';

const useCart = () => {
  const cartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const { setLoginDialogOpen } = useLoginDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { status } = useSession();

  const updateCartAmount = (item: CartItem) => {
    if (status === 'authenticated') {
      dispatch(changeCartAmount(item));
    } else {
      setLoginDialogOpen(true);
    }
  };

  return {
    cartState,
    updateCartAmount,
  };
};

export default useCart;
