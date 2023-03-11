import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { IProduct } from 'api/models/Product.model/types';

// =================================================================================
type GlobalStateType = { cart: CartItem[] };

export interface CartItem extends IProduct {
  quantity: number;
}

type CartActionType = { type: 'CHANGE_CART_AMOUNT'; payload: CartItem };
type ActionType = CartActionType;

// =================================================================================

const initialState: GlobalStateType = { cart: [] };

interface ContextProps {
  state: GlobalStateType;
  dispatch: (args: ActionType) => void;
}

const AppContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => {},
});

const reducer = (state: GlobalStateType, action: ActionType) => {
  switch (action.type) {
    case 'CHANGE_CART_AMOUNT': {
      console.log('run here');
      const cartList = state.cart;
      const cartItem = action.payload;
      const exist = cartList.find((item) => item.id === cartItem.id);

      if (cartItem.quantity < 1) {
        const filteredCart = cartList.filter((item) => item.id !== cartItem.id);
        return { ...state, cart: filteredCart };
      }

      if (exist) {
        const newCart = cartList.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: cartItem.quantity }
            : item,
        );

        return { ...state, cart: newCart };
      }

      return { ...state, cart: [...cartList, cartItem] };
    }
    default: {
      return state;
    }
  }
};

// =======================================================
type AppProviderProps = { children: ReactNode };
// =======================================================

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => useContext<ContextProps>(AppContext);

export default AppContext;
