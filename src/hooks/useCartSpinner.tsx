import { useCallback } from 'react';
import { useEffect, useState } from 'react';

import { useQuantityLimitation } from './useQuantityLimitation';

import type { IUpeProduct } from 'api/models/Product.model/types';
import NumberSpinner from 'components/common/input/NumberSpinnerInput';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';

export const useCartSpinner = (product: IUpeProduct) => {
  const { cartItem, updateCartAmount } = useCart(product.id);
  const [firstTimeRender, setFirstTimeRender] = useState(true);
  const { maxQuantity, disableAddToCart, inStock } = useQuantityLimitation(
    product.expirations,
    cartItem,
  );

  const handleCartAmountChange = useCallback(
    (amount: number, type: CartItemActionType) => {
      if (amount >= maxQuantity) return;
      updateCartAmount(
        {
          quantity: amount,
          product,
        },
        type,
      );
    },
    [maxQuantity, product, updateCartAmount],
  );

  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  useEffect(() => {
    if (firstTimeRender) {
      setFirstTimeRender(false);
      return;
    }
    const timer = setTimeout(() => {
      if (quantity !== cartItem?.quantity) {
        handleCartAmountChange(quantity, 'update');
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  const quantitySpinner = (
    <NumberSpinner
      initialValue={cartItem?.quantity || 0}
      value={quantity}
      setValue={setQuantity}
      max={maxQuantity}
    />
  );

  // console.log(cartItem?.quantity, quantity);
  return {
    inStock,
    disableAddToCart,
    handleCartAmountChange,
    quantitySpinner,
    cartItem,
  };
};
