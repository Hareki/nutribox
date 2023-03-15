import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IProduct } from 'api/models/Product.model/types';

export interface CartItem extends IProduct {
  quantity: number;
}

type CartState = { cart: CartItem[] };

const initialState: CartState = { cart: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    changeCartAmount: (state, action: PayloadAction<CartItem>) => {
      const cartItem = action.payload;
      const exist = state.cart.find((item) => item.id === cartItem.id);

      if (cartItem.quantity < 1) {
        state.cart = state.cart.filter((item) => item.id !== cartItem.id);
        return;
      }

      if (exist) {
        state.cart = state.cart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: cartItem.quantity }
            : item,
        );

        return;
      }

      state.cart.push(cartItem);
    },
  },
});

export const { changeCartAmount } = cartSlice.actions;

export default cartSlice.reducer;
