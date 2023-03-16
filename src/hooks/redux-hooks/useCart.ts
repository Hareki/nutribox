import { useSession } from 'next-auth/react';
import { useSelector, useDispatch } from 'react-redux';

import { CartItem, changeCartAmount } from '../../store/slices/cartSlice';

import useLoginDialog from './useLoginDialog';

import { AppDispatch, RootState } from 'store';

const useCart = (accountId = '640eda951bfd6bd755f28211') => {
  const cartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const { setLoginDialogOpen } = useLoginDialog();
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
