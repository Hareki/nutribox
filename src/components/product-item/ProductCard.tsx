// Product Card 13
import { RemoveRedEye } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, styled } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { CommonProductModel } from 'backend/services/product/helper';
import { H3, Span } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import ProductSpinner from 'components/common/input/ProductSpinner';
import { FlexBetween, FlexBox } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import OutOfStockChip from 'components/products/OutOfStockChip';
import ProductViewDialog from 'components/products/ProductViewDialog';
import { PRODUCT_DETAIL_ROUTE } from 'constants/routes.ui.constant';
import type { CartItemActionType } from 'hooks/global-states/useCart';
import useCart from 'hooks/global-states/useCart';
import { useQuantityLimitation } from 'hooks/useQuantityLimitation';
import { formatCurrency } from 'lib';
import { insertId } from 'utils/middleware.helper';
import { getSlug } from 'utils/string.helper';

const StyledBazaarCard = styled(BazaarCard)(({ theme }) => ({
  height: '100%',
  margin: 'auto',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '8px',
  position: 'relative',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 250ms ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[3],
    '& .controller': {
      opacity: 1,
      display: 'flex',
      bottom: 25,
    },
  },
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  textAlign: 'center',
  position: 'relative',
  padding: '34px 30px',
  // background: '#efefef',
  background: 'white.main',
  display: 'inline-block',
  [theme.breakpoints.down('sm')]: { display: 'block' },
}));

const HoverWrapper = styled(FlexBetween)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[400]}`,
  opacity: 0,
  left: 0,
  right: 0,
  width: 120,
  height: 25,
  bottom: 0,
  margin: 'auto',
  overflow: 'hidden',
  background: '#fff',
  borderRadius: '5px',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transition: 'all 0.2s ease-in-out',
  '& span, & a': {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover:not([aria-disabled=true])': {
      cursor: 'pointer',
      background: '#f3f5f9',
    },
  },
  '& span': { padding: '0px 10px' },
  '& svg': { fontSize: 18, color: theme.palette.grey[600] },
}));

const ContentWrapper = styled(FlexBox)({
  minHeight: 120,
  padding: '1rem',
  '& .title, & .categories': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

type ProductCardProps = {
  product: CommonProductModel;
  onPreview?: () => void;
};

// ===============================================================

const ProductCard: FC<ProductCardProps> = (props) => {
  const {
    product: { id, productImages, retailPrice, name, importOrders },
    onPreview,
  } = props;

  const slug = getSlug({ name, id });

  const { updateCartAmount, existingCartItem } = useCart(id);
  const [openModal, setOpenModal] = useState(false);

  const toggleDialog = useCallback(() => {
    onPreview?.();
    setOpenModal((open) => !open);
  }, [onPreview]);

  const { inStock, disableAddToCart } = useQuantityLimitation(
    props.product,
    existingCartItem,
  );

  const imageUrls = useMemo(
    () => productImages.map((item) => item.imageUrl),
    [productImages],
  );

  const handleCartAmountChange = (amount: number, type: CartItemActionType) => {
    if (type === 'add' && disableAddToCart) return;

    if (isNaN(amount)) amount = 1;
    updateCartAmount({ product: props.product, quantity: amount }, type);
  };

  return (
    <StyledBazaarCard hoverEffect>
      <ImageWrapper>
        {!inStock && <OutOfStockChip />}
        <Link href={insertId(PRODUCT_DETAIL_ROUTE, slug)}>
          <LazyImage
            alt={name}
            width={190}
            src={imageUrls[0]}
            height={190}
            layout='responsive'
            objectFit='contain'
            style={{
              filter: !inStock ? 'grayscale(100%)' : 'none',
            }}
          />
        </Link>

        <HoverWrapper className='controller'>
          <Span
            onClick={toggleDialog}
            sx={{
              borderRight: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            <RemoveRedEye />
          </Span>

          <Span
            aria-disabled={disableAddToCart}
            onClick={() =>
              handleCartAmountChange(
                (existingCartItem?.quantity || 0) + 1,
                'add',
              )
            }
          >
            <ShoppingCartIcon />
          </Span>
        </HoverWrapper>
      </ImageWrapper>

      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={props.product}
      />

      <ContentWrapper>
        <Box flex='1 1 0' minWidth='0px' mr={1}>
          <Link href={`/product/${slug}`}>
            <H3
              mb={1}
              title={name}
              fontSize='14px'
              textAlign='left'
              fontWeight='600'
              className='title'
              color='text.secondary'
            >
              {name}
            </H3>
          </Link>

          <FlexBox gap={1} alignItems='center' mt={0.5}>
            <Box
              fontWeight={600}
              color={inStock ? 'primary.main' : 'text.secondary'}
            >
              {formatCurrency(retailPrice)}
            </Box>
          </FlexBox>
        </Box>

        <ProductSpinner
          quantity={existingCartItem?.quantity}
          direction='vertical'
          disabledAddToCart={disableAddToCart}
          handleCartAmountChange={handleCartAmountChange}
        />
      </ContentWrapper>
    </StyledBazaarCard>
  );
};

export default ProductCard;
