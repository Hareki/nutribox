import { Clear } from '@mui/icons-material';
import { Box, Button, Divider, IconButton } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';

import CartDrawerItem from './CartDrawerItem';

import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import type { IUpeProduct } from 'api/models/Product.model/types';
import { Paragraph } from 'components/abstract/Typography';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CartBag from 'components/icons/CartBag';
import LazyImage from 'components/LazyImage';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';
import { formatCurrency } from 'lib';

type CartDrawerProps = { toggleCartDrawer: () => void };

const CartDrawer: FC<CartDrawerProps> = ({ toggleCartDrawer }) => {
  const { cartState, updateCartAmount } = useCart();
  const cartList = cartState.cart;

  const handleCartAmountChange =
    (amount: number, product: IUpeProduct, type: CartItemActionType) => () => {
      updateCartAmount({ product, quantity: amount }, type);
    };

  const getTotalPrice = () => {
    return cartList.reduce(
      (accumulation, item) =>
        accumulation + item.product.retailPrice * item.quantity,
      0,
    );
  };

  return (
    <FlexBox width={380} height='100%' flexDirection='column'>
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

        {cartList.map((item: IPopulatedCartItem) => (
          <CartDrawerItem
            key={item.id}
            cartItem={item}
            handleCartAmountChange={handleCartAmountChange}
          />
        ))}
      </Box>

      <Box mt='auto'>
        {cartList.length > 0 && (
          <Box p={2.5}>
            <Link href='/checkout' passHref legacyBehavior>
              <Button
                fullWidth
                color='primary'
                variant='contained'
                sx={{ mb: '0.75rem', height: '40px', color: '#fff' }}
                onClick={toggleCartDrawer}
              >
                Thanh toán ngay ({formatCurrency(getTotalPrice())})
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </FlexBox>
  );
};

export default CartDrawer;
