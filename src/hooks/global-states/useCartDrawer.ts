import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch, RootState } from 'store';
import { setCartDrawerOpen as setCartDrawerVisible } from 'store/slices/cartDrawerSlice';

const useCartDrawer = () => {
  const cartDrawerState = useSelector((state: RootState) => state.cartDrawer);
  const dispatch = useDispatch<AppDispatch>();

  //   const setCartDrawerOpen = (isOpen: boolean) => {
  //     dispatch(setCartDrawerVisible(isOpen));
  //   };

  const toggleCartDrawer = () => {
    dispatch(setCartDrawerVisible(!cartDrawerState.isOpen));
  };

  return {
    cartDrawerState,
    toggleCartDrawer,
  };
};

export default useCartDrawer;
