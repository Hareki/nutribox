import { Add, Close, Remove } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, useTheme } from '@mui/material';
import Link from 'next/link';
import { useMemo, type FC } from 'react';

import { H5, Paragraph, Span, Tiny } from '../abstract/Typography';
import { FlexBox } from '../flex-box';

import type { CommonProductModel } from 'backend/services/product/helper';
import { PRODUCT_DETAIL_ROUTE } from 'constants/routes.ui.constant';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';
import { useQuantityLimitation } from 'hooks/useQuantityLimitation';
import { formatCurrency } from 'lib';
import { insertId } from 'utils/middleware.helper';
import { getSlug } from 'utils/string.helper';

type CartDrawerItemProps = {
  productId: string;
};
const CartDrawerItem: FC<CartDrawerItemProps> = ({ productId }) => {
  const { palette } = useTheme();

  const handleCartAmountChange =
    (amount: number, product: CommonProductModel, type: CartItemActionType) =>
    () => {
      updateCartAmount({ product, quantity: amount }, type);
    };

  const { updateCartAmount, existingCartItem } = useCart(productId);

  const { maxQuantity, disableAddToCart, overLimit } = useQuantityLimitation(
    existingCartItem.product!,
    existingCartItem,
  );

  const imageUrls = useMemo(
    () => existingCartItem.product!.productImages.map((item) => item.imageUrl),
    [existingCartItem.product],
  );

  return (
    <Box borderBottom={`1px solid ${palette.divider}`}>
      <FlexBox
        py={2}
        px={2.5}
        key={existingCartItem.product!.id}
        alignItems='center'
      >
        <FlexBox alignItems='center' flexDirection='column'>
          <Button
            disabled={disableAddToCart || !existingCartItem.product!.available}
            color='primary'
            variant='outlined'
            onClick={handleCartAmountChange(
              existingCartItem.quantity! + 1,
              existingCartItem.product!,
              'add',
            )}
            sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
          >
            <Add fontSize='small' />
          </Button>

          <Box fontWeight={600} fontSize='15px' my='3px'>
            {existingCartItem.quantity!}
          </Box>

          <Button
            color='primary'
            variant='outlined'
            disabled={
              existingCartItem.quantity! === 1 ||
              !existingCartItem.product!.available
            }
            onClick={handleCartAmountChange(
              existingCartItem.quantity! - 1,
              existingCartItem.product!,
              'remove',
            )}
            sx={{ height: '32px', width: '32px', borderRadius: '300px' }}
          >
            <Remove fontSize='small' />
          </Button>
        </FlexBox>

        <Link
          href={insertId(
            PRODUCT_DETAIL_ROUTE,
            getSlug(existingCartItem.product!),
          )}
        >
          <Avatar
            variant='square'
            alt={existingCartItem.product!.name}
            src={imageUrls[0]}
            sx={{
              mx: 2,
              width: 76,
              height: 76,
              filter:
                overLimit || !existingCartItem.product!.available
                  ? 'grayscale(1)'
                  : 'none',
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
          <Link
            href={insertId(
              PRODUCT_DETAIL_ROUTE,
              getSlug(existingCartItem.product!),
            )}
          >
            <H5 ellipsis fontSize='14px' className='title'>
              {existingCartItem.product!.name}
            </H5>
          </Link>

          <Tiny color='grey.600'>
            {formatCurrency(existingCartItem.product!.retailPrice)} x{' '}
            {existingCartItem.quantity!}
          </Tiny>

          <Box
            fontWeight={600}
            fontSize='14px'
            color={
              overLimit || !existingCartItem.product!.available
                ? 'grey.600'
                : 'primary.main'
            }
            mt={0.5}
          >
            {formatCurrency(
              existingCartItem.quantity! *
                existingCartItem.product!.retailPrice,
            )}
          </Box>
        </Box>

        <IconButton
          size='small'
          onClick={handleCartAmountChange(
            0,
            existingCartItem.product!,
            'remove',
          )}
          sx={{ marginLeft: 2.5 }}
        >
          <Close fontSize='small' />
        </IconButton>
      </FlexBox>
      {!existingCartItem.product!.available && (
        <Paragraph color='error.500' textAlign='center'>
          Sản phẩm đã không còn tồn tại, vui lòng xóa sản phẩm này khỏi giỏ hàng
        </Paragraph>
      )}

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
