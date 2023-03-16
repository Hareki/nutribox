import { Add, Close, Remove } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, useTheme } from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import { FlexBox } from './flex-box';
import { H5, Tiny } from './Typography';

import { IProduct } from 'api/models/Product.model/types';
import { CartItem, CartItemActionType } from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';

type CartDrawerItemProps = {
  cartItem: CartItem;
  handleCartAmountChange: (
    amount: number,
    product: IProduct,
    type: CartItemActionType,
  ) => () => void;
};
const CartDrawerItem: FC<CartDrawerItemProps> = ({
  cartItem,
  handleCartAmountChange,
}) => {
  const { palette } = useTheme();

  return (
    <FlexBox
      py={2}
      px={2.5}
      key={cartItem.id}
      alignItems='center'
      borderBottom={`1px solid ${palette.divider}`}
    >
      <FlexBox alignItems='center' flexDirection='column'>
        <Button
          color='primary'
          variant='outlined'
          onClick={handleCartAmountChange(
            cartItem.quantity + 1,
            cartItem,
            'add',
          )}
          sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
        >
          <Add fontSize='small' />
        </Button>

        <Box fontWeight={600} fontSize='15px' my='3px'>
          {cartItem.quantity}
        </Box>

        <Button
          color='primary'
          variant='outlined'
          disabled={cartItem.quantity === 1}
          onClick={handleCartAmountChange(
            cartItem.quantity - 1,
            cartItem,
            'remove',
          )}
          sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
        >
          <Remove fontSize='small' />
        </Button>
      </FlexBox>

      <Link href={`/product/${cartItem.id}`}>
        <Avatar
          alt={cartItem.name}
          // FIXME
          src={cartItem.imageUrls[0]}
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
        <Link href={`/product/${cartItem.slug}`}>
          <H5 ellipsis fontSize='14px' className='title'>
            {cartItem.name}
          </H5>
        </Link>

        <Tiny color='grey.600'>
          {currency(cartItem.retailPrice)} x {cartItem.quantity}
        </Tiny>

        <Box fontWeight={600} fontSize='14px' color='primary.main' mt={0.5}>
          {currency(cartItem.quantity * cartItem.retailPrice)}
        </Box>
      </Box>

      <IconButton
        size='small'
        onClick={handleCartAmountChange(0, cartItem, 'remove')}
        sx={{ marginLeft: 2.5 }}
      >
        <Close fontSize='small' />
      </IconButton>
    </FlexBox>
  );
};

export default CartDrawerItem;
