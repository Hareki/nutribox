import { useSelector, useDispatch } from 'react-redux';

import { CartItem, changeCartAmount } from '../store/slices/cartSlice';

import { AppDispatch, RootState } from 'store';

const useCart = () => {
  const cartState = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const updateCartAmount = (item: CartItem) => {
    dispatch(changeCartAmount(item));
  };

  return {
    cartState,
    updateCartAmount,
  };
};

export default useCart;
