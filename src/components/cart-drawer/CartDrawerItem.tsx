import { Add, Close, Remove } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, useTheme } from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import { H5, Tiny } from '../abstract/Typography';
import { FlexBox } from '../flex-box';

import { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import { IProduct } from 'api/models/Product.model/types';
import { CartItemActionType } from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';

type CartDrawerItemProps = {
  cartItem: IPopulatedCartItem;
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
            cartItem.product,
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
            cartItem.product,
            'remove',
          )}
          sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
        >
          <Remove fontSize='small' />
        </Button>
      </FlexBox>

      <Link href={`/product/${cartItem.id}`}>
        <Avatar
          alt={cartItem.product.name}
          // FIXME
          src={cartItem.product.imageUrls[0]}
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
        <Link href={`/product/${cartItem.product.slug}`}>
          <H5 ellipsis fontSize='14px' className='title'>
            {cartItem.product.name}
          </H5>
        </Link>

        <Tiny color='grey.600'>
          {currency(cartItem.product.retailPrice)} x {cartItem.quantity}
        </Tiny>

        <Box fontWeight={600} fontSize='14px' color='primary.main' mt={0.5}>
          {currency(cartItem.quantity * cartItem.product.retailPrice)}
        </Box>
      </Box>

      <IconButton
        size='small'
        onClick={handleCartAmountChange(0, cartItem.product, 'remove')}
        sx={{ marginLeft: 2.5 }}
      >
        <Close fontSize='small' />
      </IconButton>
    </FlexBox>
  );
};

export default CartDrawerItem;
