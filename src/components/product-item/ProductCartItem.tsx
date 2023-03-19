// Product Card 7
import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Card, IconButton, styled } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { FC } from 'react';

import type { IPopulatedCartItem } from 'api/models/Account.model/CartItem.schema/types';
import { Span } from 'components/abstract/Typography';
import MuiNextImage from 'components/common/input/MuiNextImage';
import { FlexBox } from 'components/flex-box';
import type { CartItemActionType } from 'hooks/redux-hooks/useCart';
import useCart from 'hooks/redux-hooks/useCart';
import useLoginDialog from 'hooks/redux-hooks/useLoginDialog';
import { formatCurrency } from 'lib';

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

interface ProductCartItemProps extends IPopulatedCartItem {}

const ProductCartItem: FC<ProductCartItemProps> = ({ quantity, product }) => {
  const { slug, imageUrls, name, retailPrice } = product;
  const { updateCartAmount } = useCart();
  const { setLoginDialogOpen } = useLoginDialog();
  const { status } = useSession();
  // handle change cart
  const handleCartAmountChange =
    (amount: number, type: CartItemActionType) => () => {
      if (status === 'authenticated') {
        updateCartAmount(
          {
            product,
            quantity: amount,
          },
          type,
        );
      } else {
        setLoginDialogOpen(true);
      }
    };

  return (
    <Wrapper>
      <MuiNextImage
        alt={name}
        width={140}
        height={140}
        display='block'
        style={{
          objectFit: 'contain',
          padding: '8px',
        }}
        src={imageUrls[0]}
      />

      <IconButton
        size='small'
        onClick={handleCartAmountChange(0, 'remove')}
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
            {formatCurrency(retailPrice)} x {quantity}
          </Span>

          <Span fontWeight={600} color='primary.main'>
            {formatCurrency(retailPrice * quantity)}
          </Span>
        </FlexBox>

        <FlexBox alignItems='center'>
          <Button
            color='primary'
            sx={{ p: '5px' }}
            variant='outlined'
            disabled={quantity === 1}
            onClick={handleCartAmountChange(quantity - 1, 'remove')}
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
            onClick={handleCartAmountChange(quantity + 1, 'add')}
          >
            <Add fontSize='small' />
          </Button>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default ProductCartItem;
