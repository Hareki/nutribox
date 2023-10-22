import { Add, Close, Remove } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, useTheme } from '@mui/material';
import Link from 'next/link';
import { useMemo, type FC } from 'react';

import { H5, Paragraph, Span, Tiny } from '../abstract/Typography';
import { FlexBox } from '../flex-box';

import type {
  CommonCartItem,
  CommonProductModel,
} from 'backend/services/product/helper';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import { useQuantityLimitation } from 'hooks/useQuantityLimitation';
import { formatCurrency } from 'lib';
import { getSlug } from 'utils/string.helper';

type CartDrawerItemProps = {
  cartItem: CommonCartItem;
  handleCartAmountChange: (
    amount: number,
    product: CommonProductModel,
    type: CartItemActionType,
  ) => () => void;
};
const CartDrawerItem: FC<CartDrawerItemProps> = ({
  cartItem,
  handleCartAmountChange,
}) => {
  const { palette } = useTheme();
  console.log('cartItem', cartItem);

  const { maxQuantity, disableAddToCart, overLimit } = useQuantityLimitation(
    cartItem.product.importOrders,
    cartItem,
  );

  const imageUrls = useMemo(
    () => cartItem.product.productImages.map((item) => item.imageUrl),
    [cartItem.product.productImages],
  );

  return (
    <Box borderBottom={`1px solid ${palette.divider}`}>
      <FlexBox py={2} px={2.5} key={cartItem.product.id} alignItems='center'>
        <FlexBox alignItems='center' flexDirection='column'>
          <Button
            disabled={disableAddToCart}
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

        <Link href={`/product/${cartItem.product.id}`}>
          <Avatar
            variant='square'
            alt={cartItem.product.name}
            src={imageUrls[0]}
            sx={{
              mx: 2,
              width: 76,
              height: 76,
              filter: overLimit ? 'grayscale(1)' : 'none',
              '& .MuiAvatar-img': {
                objectFit: 'contain',
              },
            }}
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
          <Link href={`/product/${getSlug(cartItem.product)}`}>
            <H5 ellipsis fontSize='14px' className='title'>
              {cartItem.product.name}
            </H5>
          </Link>

          <Tiny color='grey.600'>
            {formatCurrency(cartItem.product.retailPrice)} x {cartItem.quantity}
          </Tiny>

          <Box
            fontWeight={600}
            fontSize='14px'
            color={overLimit ? 'text.secondary' : 'primary.main'}
            mt={0.5}
          >
            {formatCurrency(cartItem.quantity * cartItem.product.retailPrice)}
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
      {overLimit && (
        <Paragraph color='error.500' textAlign='center'>
          Chỉ còn <Span fontWeight={600}>{maxQuantity}</Span> sản phẩm này, vui
          lòng giảm số lượng
        </Paragraph>
      )}
    </Box>
  );
};

export default CartDrawerItem;
