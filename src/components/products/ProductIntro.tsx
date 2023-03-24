import { Add, Remove } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { Box, Button, Grid, useTheme } from '@mui/material';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { FlexBox, FlexRowCenter } from '../flex-box';

import type { IUpeProduct } from 'api/models/Product.model/types';
import { H1, H2, H3, H6 } from 'components/abstract/Typography';
import LazyImage from 'components/LazyImage';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';
import { useQuantityLimitation } from 'hooks/useQuantityLimitation';
import { formatCurrency } from 'lib';
import axiosInstance from 'utils/axiosInstance';

// ================================================================
type ProductIntroProps = { product: IUpeProduct; sx?: SxProps<Theme> };
// ================================================================

const ProductIntro: FC<ProductIntroProps> = ({ product, sx }) => {
  const {
    id,
    retailPrice,
    name,
    imageUrls,
    description,
    category,
    available,
    expirations,
  } = product;

  const { palette } = useTheme();
  const [categoryName, setCategoryName] = useState('đang tải...');

  useEffect(() => {
    if (categoryName === 'đang tải...') {
      console.log('axiosInstance.getUri()', axiosInstance.getUri());
      axiosInstance.get(`/category/${category}`).then((res) => {
        setCategoryName(res.data.data.name);
      });
    }
  }, [category, categoryName]);

  const [selectedImage, setSelectedImage] = useState(0);
  const { cartItem, updateCartAmount } = useCart(id);
  const { inStock, disableAddToCart } = useQuantityLimitation(
    expirations,
    cartItem,
  );

  const handleImageClick = (index: number) => () => setSelectedImage(index);

  const handleCartAmountChange =
    (amount: number, type: CartItemActionType) => () => {
      if (type === 'add' && disableAddToCart) return;
      updateCartAmount(
        {
          quantity: amount,
          product,
        },
        type,
      );
    };

  return (
    <Box sx={sx} width='100%'>
      <Grid container spacing={3} justifyContent='space-around'>
        <Grid item md={6} xs={12} alignItems='center'>
          <FlexBox justifyContent='center' mb={6}>
            <Box
              border={`2px solid ${palette.primary[300]}`}
              borderRadius='10px'
              lineHeight={0}
            >
              <LazyImage
                alt={name}
                borderRadius='10px'
                width={400}
                height={300}
                quality={100}
                loading='eager'
                objectFit='contain'
                src={imageUrls[selectedImage]}
              />
            </Box>
          </FlexBox>

          <FlexBox overflow='auto'>
            {imageUrls.map((url, index) => (
              <FlexRowCenter
                key={index}
                width={64}
                height={64}
                minWidth={64}
                bgcolor='white'
                border='1px solid'
                borderRadius='10px'
                ml={index === 0 ? 'auto' : 0}
                style={{ cursor: 'pointer' }}
                onClick={handleImageClick(index)}
                mr={index === imageUrls.length - 1 ? 'auto' : '10px'}
                borderColor={
                  selectedImage === index ? 'primary.main' : 'grey.400'
                }
              >
                <LazyImage
                  src={url}
                  quality={100}
                  objectFit='contain'
                  width={100}
                  height={100}
                />
              </FlexRowCenter>
            ))}
          </FlexBox>
        </Grid>

        <Grid item md={6} xs={12} alignItems='center'>
          <H1 mb={1}>{name}</H1>

          <FlexBox alignItems='center' mb={1}>
            <Box>Danh mục: &nbsp;</Box>
            <H6>{categoryName}</H6>
          </FlexBox>

          <Box pt={1} mb={3}>
            {description}
          </Box>

          <Box pt={1} mb={3}>
            <H2 color='primary.main' mb={0.5} lineHeight='1'>
              {formatCurrency(retailPrice)}
            </H2>
            <Box color='inherit'>
              {!disableAddToCart ? 'Còn hàng' : 'Hết hàng'}
            </Box>
          </Box>

          {!cartItem?.quantity ? (
            <Button
              disabled={disableAddToCart}
              color='primary'
              variant='contained'
              onClick={handleCartAmountChange(1, 'add')}
              sx={{ mb: 4.5, px: '1.75rem', height: 40 }}
            >
              {disableAddToCart ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </Button>
          ) : (
            <FlexBox alignItems='center' mb={4.5}>
              <Button
                size='small'
                sx={{ p: 1 }}
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(
                  cartItem?.quantity - 1,
                  'remove',
                )}
              >
                <Remove fontSize='small' />
              </Button>

              <H3 fontWeight='600' mx={2.5}>
                {cartItem?.quantity.toString().padStart(2, '0')}
              </H3>

              <Button
                disabled={disableAddToCart}
                size='small'
                sx={{ p: 1 }}
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(cartItem?.quantity + 1, 'add')}
              >
                <Add fontSize='small' />
              </Button>
            </FlexBox>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
