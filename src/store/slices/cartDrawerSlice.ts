import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type CartDrawerState = { isOpen: boolean };

const initialState: CartDrawerState = { isOpen: false };

const cartDrawerSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setCartDrawerOpen } = cartDrawerSlice.actions;

export default cartDrawerSlice.reducer;
