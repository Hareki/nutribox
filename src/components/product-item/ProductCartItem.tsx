// Product Card 7
import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Card, IconButton, styled } from '@mui/material';
import Link from 'next/link';
import { FC } from 'react';

import Image from 'components/BazaarImage';
import { FlexBox } from 'components/flex-box';
import { Span } from 'components/Typography';
import useCart from 'hooks/useCart';
import { currency } from 'lib';
import { CartItem } from 'store/slices/cartSlice';

const Wrapper = styled(Card)(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '10px',
  marginBottom: '1.5rem',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,

  '@media only screen and (max-width: 425px)': {
    flexWrap: 'wrap',
    img: { height: 'auto', minWidth: '100%' },
  },
}));

interface ProductCartItemProps extends CartItem {}

const ProductCartItem: FC<ProductCartItemProps> = ({
  quantity,
  ...product
}) => {
  const { slug, imageUrls, name, retailPrice } = product;
  const { updateCartAmount } = useCart();
  // handle change cart
  const handleCartAmountChange = (amount: number) => () => {
    updateCartAmount({
      quantity: amount,
      ...product,
    });
  };

  return (
    <Wrapper>
      <Image
        alt={name}
        width={140}
        height={140}
        display='block'
        src={imageUrls[0]}
      />

      <IconButton
        size='small'
        onClick={handleCartAmountChange(0)}
        sx={{ position: 'absolute', right: 15, top: 15 }}
      >
        <Close fontSize='small' />
      </IconButton>

      <FlexBox p={2} rowGap={2} width='100%' flexDirection='column'>
        <Link href={`/product/${slug}`}>
          <Span ellipsis fontWeight='600' fontSize={18}>
            {name}
          </Span>
        </Link>

        <FlexBox gap={1} flexWrap='wrap' alignItems='center'>
          <Span color='grey.600'>
            {currency(retailPrice)} x {quantity}
          </Span>

          <Span fontWeight={600} color='primary.main'>
            {currency(retailPrice * quantity)}
          </Span>
        </FlexBox>

        <FlexBox alignItems='center'>
          <Button
            color='primary'
            sx={{ p: '5px' }}
            variant='outlined'
            disabled={quantity === 1}
            onClick={handleCartAmountChange(quantity - 1)}
          >
            <Remove fontSize='small' />
          </Button>

          <Span mx={1} fontWeight={600} fontSize={15}>
            {quantity}
          </Span>
          <Button
            color='primary'
            sx={{ p: '5px' }}
            variant='outlined'
            onClick={handleCartAmountChange(quantity + 1)}
          >
            <Add fontSize='small' />
          </Button>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default ProductCartItem;
