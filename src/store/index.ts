import { configureStore } from '@reduxjs/toolkit';

import loginDialogReducer from './slices/loginDialogSlice';

export const store = configureStore({
  reducer: {
    loginDialog: loginDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
