import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';
import loginDialogReducer from './slices/loginDialogSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    loginDialog: loginDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
