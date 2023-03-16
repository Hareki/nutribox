import { Clear } from '@mui/icons-material';
import { Box, Button, Divider, IconButton } from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import CartDrawerItem from './CartDrawerItem';

import { IProduct } from 'api/models/Product.model/types';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CartBag from 'components/icons/CartBag';
import LazyImage from 'components/LazyImage';
import { Paragraph } from 'components/Typography';
import useCart, { CartItemActionType } from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';
import { CartItem } from 'store/slices/cartSlice';

type CartDrawerProps = { toggleCartDrawer: () => void };

const CartDrawer: FC<CartDrawerProps> = ({ toggleCartDrawer }) => {
  const { cartState, updateCartAmount } = useCart();
  const cartList = cartState.cart;

  const handleCartAmountChange =
    (amount: number, product: IProduct, type: CartItemActionType) => () => {
      updateCartAmount({ ...product, quantity: amount }, type);
    };

  const getTotalPrice = () => {
    return cartList.reduce(
      (accumulation, item) => accumulation + item.retailPrice * item.quantity,
      0,
    );
  };

  console.log('cartList', cartList);

  return (
    <Box width={380}>
      <Box
        overflow='auto'
        height={`calc(100vh - ${cartList.length ? '80px - 3.25rem' : '0px'})`}
      >
        <FlexBetween mx={3} height={75}>
          <FlexBox gap={1} alignItems='center' color='secondary.main'>
            <CartBag color='inherit' />

            <Paragraph lineHeight={0} fontWeight={600}>
              {cartList.length} sản phẩm
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleCartDrawer}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cartList.length <= 0 && (
          <FlexBox
            alignItems='center'
            flexDirection='column'
            justifyContent='center'
            height='calc(100% - 80px)'
          >
            <LazyImage
              width={90}
              height={100}
              alt='banner'
              src='/assets/images/logos/shopping-bag.svg'
            />
            <Box
              component='p'
              mt={2}
              color='grey.600'
              textAlign='center'
              maxWidth='200px'
            >
              Giỏ hàng của bạn đang trống, hãy đặt món ngay!
            </Box>
          </FlexBox>
        )}

        {cartList.map((item: CartItem) => (
          <CartDrawerItem
            key={item.id}
            cartItem={item}
            handleCartAmountChange={handleCartAmountChange}
          />
        ))}
      </Box>

      {cartList.length > 0 && (
        <Box p={2.5}>
          <Link href='/checkout-alternative' passHref legacyBehavior>
            <Button
              fullWidth
              color='primary'
              variant='contained'
              sx={{ mb: '0.75rem', height: '40px', color: '#fff' }}
              onClick={toggleCartDrawer}
            >
              Checkout Now ({currency(getTotalPrice())})
            </Button>
          </Link>

          <Link href='/cart' passHref legacyBehavior>
            <Button
              fullWidth
              color='primary'
              variant='outlined'
              sx={{ height: 40 }}
              onClick={toggleCartDrawer}
            >
              View Cart
            </Button>
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default CartDrawer;
