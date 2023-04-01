import { configureStore } from '@reduxjs/toolkit';

import cartDrawerReducer from './slices/cartDrawerSlice';
import loginDialogReducer from './slices/loginDialogSlice';

export const store = configureStore({
  reducer: {
    loginDialog: loginDialogReducer,
    cartDrawer: cartDrawerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
