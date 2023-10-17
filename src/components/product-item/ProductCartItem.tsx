// Product Card 7
import { Add, Close, Remove } from '@mui/icons-material';
import { Button, Card, IconButton, styled } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useMemo, type FC } from 'react';

import type { CommonCartItem } from 'backend/services/product/helper';
import { Paragraph, Span } from 'components/abstract/Typography';
import MuiNextImage from 'components/common/input/MuiNextImage';
import { FlexBox } from 'components/flex-box';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';
import useLoginDialog from 'hooks/global-states/useLoginDialog';
import { useQuantityLimitation } from 'hooks/useQuantityLimitation';
import { formatCurrency } from 'lib';
import { getSlug } from 'utils/string.helper';

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

interface ProductCartItemProps extends CommonCartItem {}

const ProductCartItem: FC<ProductCartItemProps> = ({ quantity, product }) => {
  const { productImages, name, retailPrice, id } = product;
  const { updateCartAmount, cartItem } = useCart(product.id);
  const { setLoginDialogOpen } = useLoginDialog();
  const { status } = useSession();
  const { overLimit, maxQuantity, disableAddToCart } = useQuantityLimitation(
    product.importOrders,
    cartItem,
  );

  const imageUrls = useMemo(
    () => productImages.map((item) => item.imageUrl),
    [productImages],
  );

  const handleCartAmountChange =
    (amount: number, type: CartItemActionType) => () => {
      if (disableAddToCart && type === 'add') return;

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
        <Link href={`/product/${getSlug(name, id)}`}>
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
            sx={{ p: '5px', borderRadius: '50%' }}
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
            disabled={disableAddToCart}
            color='primary'
            sx={{ p: '5px', borderRadius: '50%' }}
            variant='outlined'
            onClick={handleCartAmountChange(quantity + 1, 'add')}
          >
            <Add fontSize='small' />
          </Button>
        </FlexBox>

        {overLimit && (
          <Paragraph color='error.500'>
            Chỉ còn <Span fontWeight={600}>{maxQuantity}</Span> sản phẩm này,
            vui lòng giảm số lượng
          </Paragraph>
        )}
      </FlexBox>
    </Wrapper>
  );
};

export default ProductCartItem;
