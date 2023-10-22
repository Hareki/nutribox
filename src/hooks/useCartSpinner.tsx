// Product Card 13
import { useCallback, useState } from 'react';
import { useEffect } from 'react';

import { useQuantityLimitation } from './useQuantityLimitation';

import type { CommonProductModel } from 'backend/services/product/helper';
import ProductSpinner from 'components/common/input/ProductSpinner';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';

export const useCartSpinner = (product: CommonProductModel) => {
  const { existingCartItem, updateCartAmount } = useCart(product.id);
  const [firstTimeRender, setFirstTimeRender] = useState(true);
  const { maxQuantity, disableAddToCart, inStock } = useQuantityLimitation(
    product,
    existingCartItem,
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

  const [quantity, setQuantity] = useState(existingCartItem?.quantity || 0);

  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity);
    }
  }, [existingCartItem]);

  useEffect(() => {
    if (firstTimeRender) {
      setFirstTimeRender(false);
      return;
    }
    const timer = setTimeout(() => {
      if (quantity !== existingCartItem?.quantity) {
        handleCartAmountChange(quantity, 'update');
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantity]);

  const quantitySpinner = (
    <ProductSpinner
      quantity={existingCartItem?.quantity}
      direction='horizontal'
      disabledAddToCart={disableAddToCart}
      handleCartAmountChange={handleCartAmountChange}
    />
  );

  return {
    inStock,
    disableAddToCart,
    handleCartAmountChange,
    quantitySpinner,
    cartItem: existingCartItem,
  };
};
