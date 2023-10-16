import { Close } from '@mui/icons-material';
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
import type { FC } from 'react';
import { useState, useEffect } from 'react';

import OutOfStockChip from './OutOfStockChip';

import type { IUpeProduct } from 'api/models/Product.model/types';
import { H1, H2, Paragraph } from 'components/abstract/Typography';
import Carousel from 'components/carousel/Carousel';
import MuiImage from 'components/common/input/MuiImage';
import { useCartSpinner } from 'hooks/useCartSpinner';
import { formatCurrency } from 'lib';
import axiosInstance from 'constants/axiosFe.constant';

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
  product: IUpeProduct;
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

  const {
    inStock,
    handleCartAmountChange,
    quantitySpinner,
    disableAddToCart,
    cartItem,
  } = useCartSpinner(product);

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
              {!inStock && <OutOfStockChip top='20px' left='20px' />}
              <Carousel
                totalSlides={product.imageUrls.length}
                visibleSlides={1}
              >
                {product.imageUrls.map((item: string, index: number) => (
                  <MuiImage
                    key={index}
                    src={item}
                    sx={{
                      mx: 'auto',
                      width: '100%',
                      objectFit: 'contain',
                      height: { sm: 400, xs: 250 },
                      filter: !inStock ? 'grayscale(1)' : 'none',
                    }}
                  />
                ))}
              </Carousel>
            </Grid>

            <Grid item md={6} xs={12} alignSelf='center'>
              <H2>{product.name}</H2>

              <Paragraph py={1} color='grey.500' fontWeight={600} fontSize={13}>
                Danh mục: {categoryName}
              </Paragraph>

              <H1 color='primary.main'>
                {formatCurrency(product.retailPrice)}
              </H1>

              <Paragraph my={2}>{product.description}</Paragraph>

              <Divider sx={{ mb: 2 }} />

              {!cartItem?.quantity ? (
                <Button
                  disabled={disableAddToCart}
                  size='large'
                  color='primary'
                  variant='contained'
                  onClick={() => handleCartAmountChange(1, 'add')}
                  sx={{ height: 45 }}
                >
                  Thêm vào giỏ hàng
                </Button>
              ) : (
                quantitySpinner
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
