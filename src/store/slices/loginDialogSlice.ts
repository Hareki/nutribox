import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type LoginDialogState = { isOpen: boolean };

const initialState: LoginDialogState = { isOpen: false };

const loginDialogSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoginDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setLoginDialogOpen } = loginDialogSlice.actions;

export default loginDialogSlice.reducer;
