import { Add, Remove } from '@mui/icons-material';
import { Box, Button, Grid, SxProps, Theme, useTheme } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { FlexBox, FlexRowCenter } from '../flex-box';

import { IProduct } from 'api/models/Product.model/types';
import LazyImage from 'components/LazyImage';
import { H1, H2, H3, H6 } from 'components/Typography';
import useCart from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';
import axiosInstance from 'utils/axiosInstance';

// ================================================================
type ProductIntroProps = { product: IProduct; sx?: SxProps<Theme> };
// ================================================================

const ProductIntro: FC<ProductIntroProps> = ({ product, sx }) => {
  const { id, retailPrice, name, imageUrls, description, category, available } =
    product;

  const { palette } = useTheme();
  const [categoryName, setCategoryName] = useState('đang tải...');

  useEffect(() => {
    if (categoryName === 'đang tải...') {
      axiosInstance.get(`/category/${category}`).then((res) => {
        setCategoryName(res.data.data.name);
      });
    }
  }, [category, categoryName]);

  const { cartState, updateCartAmount } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectVariants, setSelectVariants] = useState({
    option: 'option 1',
    type: 'type 1',
  });

  // HANDLE CHANGE TYPE AND OPTIONS
  const handleChangeVariant = (variantName: string, value: string) => () => {
    setSelectVariants((state) => ({
      ...state,
      [variantName.toLowerCase()]: value,
    }));
  };

  // CHECK PRODUCT EXIST OR NOT IN THE CART
  const cartItem = cartState.cart.find((item) => item.id === id);

  // HANDLE SELECT IMAGE
  const handleImageClick = (index: number) => () => setSelectedImage(index);

  // HANDLE CHANGE CART
  const handleCartAmountChange = (amount: number) => () => {
    updateCartAmount({
      quantity: amount,
      ...product,
    });
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
              {currency(retailPrice)}
            </H2>
            <Box color='inherit'>{available ? 'Còn hàng' : 'Hết hàng'}</Box>
          </Box>

          {!cartItem?.quantity ? (
            <Button
              color='primary'
              variant='contained'
              onClick={handleCartAmountChange(1)}
              sx={{ mb: 4.5, px: '1.75rem', height: 40 }}
            >
              Thêm vào giỏ hàng
            </Button>
          ) : (
            <FlexBox alignItems='center' mb={4.5}>
              <Button
                size='small'
                sx={{ p: 1 }}
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(cartItem?.quantity - 1)}
              >
                <Remove fontSize='small' />
              </Button>

              <H3 fontWeight='600' mx={2.5}>
                {cartItem?.quantity.toString().padStart(2, '0')}
              </H3>

              <Button
                size='small'
                sx={{ p: 1 }}
                color='primary'
                variant='outlined'
                onClick={handleCartAmountChange(cartItem?.quantity + 1)}
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
