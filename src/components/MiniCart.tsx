import { Add, Clear, Close, Remove } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CartBag from 'components/icons/CartBag';
import LazyImage from 'components/LazyImage';
import { H5, Paragraph, Tiny } from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { currency } from 'lib';

type CartDrawerProps = { toggleCartDrawer: () => void };

const CartDrawer: FC<CartDrawerProps> = ({ toggleCartDrawer }) => {
  const { palette } = useTheme();
  const { state, dispatch } = useAppContext();
  const cartList = state.cart;

  const handleCartAmountChange = (amount: number, product:IProduct) => () => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: { ...product, quantity: amount },
    });
  };

  const getTotalPrice = () => {
    return cartList.reduce(
      (accumulation, item) => accumulation + item.retailPrice * item.quantity,
      0,
    );
  };

  return (
    <Box width='100%' maxWidth={380}>
      <Box
        overflow='auto'
        height={`calc(100vh - ${cartList.length ? '80px - 3.25rem' : '0px'})`}
      >
        <FlexBetween mx={3} height={74}>
          <FlexBox gap={1} alignItems='center' color='secondary.main'>
            <CartBag color='inherit' />

            <Paragraph lineHeight={0} fontWeight={600}>
              {cartList.length} item
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
            height='calc(100% - 74px)'
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

        {cartList.map((item) => (
          <FlexBox
            py={2}
            px={2.5}
            key={item.id}
            alignItems='center'
            borderBottom={`1px solid ${palette.divider}`}
          >
            <FlexBox alignItems='center' flexDirection='column'>
              <Button
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(item.quantity + 1, item)}
                sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
              >
                <Add fontSize='small' />
              </Button>

              <Box fontWeight={600} fontSize='15px' my='3px'>
                {item.quantity}
              </Box>

              <Button
                color='primary'
                variant='outlined'
                disabled={item.quantity === 1}
                onClick={handleCartAmountChange(item.quantity - 1, item)}
                sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
              >
                <Remove fontSize='small' />
              </Button>
            </FlexBox>

            <Link href={`/product/${item.id}`}>
              <Avatar
                alt={item.name}
                // FIXME
                // src={item.imageUrl}
                sx={{ mx: 2, width: 76, height: 76 }}
              />
            </Link>

            <Box
              flex='1'
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Link href={`/product/${item.slug}`}>
                <H5 ellipsis fontSize='14px' className='title'>
                  {item.name}
                </H5>
              </Link>

              <Tiny color='grey.600'>
                {currency(item.retailPrice)} x {item.quantity}
              </Tiny>

              <Box
                fontWeight={600}
                fontSize='14px'
                color='primary.main'
                mt={0.5}
              >
                {currency(item.quantity * item.retailPrice)}
              </Box>
            </Box>

            <IconButton
              size='small'
              onClick={handleCartAmountChange(0, item)}
              sx={{ marginLeft: 2.5 }}
            >
              <Close fontSize='small' />
            </IconButton>
          </FlexBox>
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
