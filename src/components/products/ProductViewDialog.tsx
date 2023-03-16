import { Add, Close, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  styled,
} from '@mui/material';
import { FC, useState, useEffect } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import BazaarImage from 'components/BazaarImage';
import Carousel from 'components/carousel/Carousel';
import { FlexBox } from 'components/flex-box';
import { H1, H2, H3, Paragraph } from 'components/Typography';
import useCart, { CartItemActionType } from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';
import axiosInstance from 'utils/axiosInstance';

// styled components
const ContentWrapper = styled(Box)(({ theme }) => ({
  '& .carousel:hover': {
    cursor: 'pointer',
    '& .carousel__back-button': { opacity: 1, left: 10 },
    '& .carousel__next-button': { opacity: 1, right: 10 },
  },
  '& .carousel__next-button, & .carousel__back-button': {
    opacity: 0,
    boxShadow: 'none',
    transition: 'all 0.3s',
    background: 'transparent',
    color: theme.palette.primary.main,
    ':disabled': { color: theme.palette.grey[500] },
    ':hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
    },
  },
  '& .carousel__back-button': { left: 0 },
  '& .carousel__next-button': { right: 0 },
}));

// =====================================================
type ProductViewDialogProps = {
  product: IProduct;
  categoryName?: string;
  openDialog: boolean;
  handleCloseDialog: () => void;
};
// =====================================================

const ProductViewDialog: FC<ProductViewDialogProps> = (props) => {
  const { product, openDialog, handleCloseDialog } = props;
  const [categoryName, setCategoryName] = useState('đang tải...');

  useEffect(() => {
    if (categoryName === 'đang tải...' && openDialog) {
      axiosInstance.get(`/category/${product.category}`).then((res) => {
        setCategoryName(res.data.data.name);
      });
    }
  }, [openDialog, categoryName, product.category]);

  const { cartState, updateCartAmount } = useCart();
  const cartItem = cartState.cart.find((item) => item.id === product.id);

  const handleCartAmountChange =
    (amount: number, type: CartItemActionType) => () => {
      updateCartAmount(
        {
          quantity: amount,
          ...product,
        },
        type,
      );
    };

  return (
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      sx={{ zIndex: 1501 }}
    >
      <DialogContent sx={{ maxWidth: 900, width: '100%' }}>
        <ContentWrapper>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Carousel
                totalSlides={product.imageUrls.length}
                visibleSlides={1}
              >
                {product.imageUrls.map((item: string, index: number) => (
                  <BazaarImage
                    key={index}
                    src={item}
                    sx={{
                      mx: 'auto',
                      width: '100%',
                      objectFit: 'contain',
                      height: { sm: 400, xs: 250 },
                    }}
                  />
                ))}
              </Carousel>
            </Grid>

            <Grid item md={6} xs={12} alignSelf='center'>
              <H2>{product.name}</H2>

              <Paragraph py={1} color='grey.500' fontWeight={600} fontSize={13}>
                DANH MỤC: {categoryName}
              </Paragraph>

              <H1 color='primary.main'>{currency(product.retailPrice)}</H1>

              <Paragraph my={2}>{product.description}</Paragraph>

              <Divider sx={{ mb: 2 }} />

              {!cartItem?.quantity ? (
                <Button
                  size='large'
                  color='primary'
                  variant='contained'
                  onClick={handleCartAmountChange(1, 'add')}
                  sx={{ height: 45 }}
                >
                  Thêm vào giỏ hàng
                </Button>
              ) : (
                <FlexBox alignItems='center'>
                  <Button
                    size='small'
                    color='primary'
                    variant='outlined'
                    sx={{ p: '.6rem', height: 45 }}
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
                    size='small'
                    color='primary'
                    variant='outlined'
                    sx={{ p: '.6rem', height: 45 }}
                    onClick={handleCartAmountChange(
                      cartItem?.quantity + 1,
                      'add',
                    )}
                  >
                    <Add fontSize='small' />
                  </Button>
                </FlexBox>
              )}
            </Grid>
          </Grid>
        </ContentWrapper>

        <IconButton
          sx={{ position: 'absolute', top: 3, right: 3 }}
          onClick={handleCloseDialog}
        >
          <Close fontSize='small' color='secondary' />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};

export default ProductViewDialog;
