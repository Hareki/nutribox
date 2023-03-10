// Product Card 13
import { Add, Favorite, Remove, RemoveRedEye } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Box, Button, Chip, styled } from '@mui/material';
import Link from 'next/link';
import { useSnackbar } from 'notistack';
import { FC, Fragment, useCallback, useState } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import BazaarCard from 'components/BazaarCard';
import BazaarRating from 'components/BazaarRating';
import { FlexBetween, FlexBox } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import ProductViewDialog from 'components/products/ProductViewDialog';
import { H3, Span } from 'components/Typography';
import { CartItem, useAppContext } from 'contexts/AppContext';
import { calculateDiscount, currency } from 'lib';

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
    boxShadow: theme.shadows[2],
    '& .controller': { display: 'flex', bottom: 20 },
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
  left: 0,
  right: 0,
  width: 120,
  height: 25,
  bottom: -40,
  margin: 'auto',
  overflow: 'hidden',
  background: '#fff',
  borderRadius: '5px',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transition: 'bottom 0.3s ease-in-out',
  '& span, & a': {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '&:hover': { cursor: 'pointer', background: '#f3f5f9' },
  },
  '& span': { padding: '0px 10px' },
  '& svg': { fontSize: 18, color: theme.palette.grey[600] },
}));

const StyledChip = styled(Chip)({
  zIndex: 11,
  top: '10px',
  left: '10px',
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: '10px',
  position: 'absolute',
});

const ContentWrapper = styled(FlexBox)({
  minHeight: 110,
  padding: '1rem',
  '& .title, & .categories': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

// ===============================================================
type ProductCardProps = {
  product: IProduct;
  onPreview?: () => void;
};
// ===============================================================

const ProductCard: FC<ProductCardProps> = (props) => {
  const {
    product: { description, _id, category, imageUrls, retailPrice, name, slug },
    onPreview,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleIsFavorite = () => setIsFavorite((fav) => !fav);
  const toggleDialog = useCallback(() => {
    onPreview?.();
    setOpenModal((open) => !open);
  }, []);

  const cartItem: CartItem | undefined = state.cart.find(
    (item) => item.slug === slug,
  );

  // const handleCartAmountChange =
  //   (amount: number, type?: 'add' | 'remove') => () => {
  //     dispatch({
  //       type: 'CHANGE_CART_AMOUNT',
  //       payload: { price, imgUrl, id, name: title, qty: amount, slug },
  //     });

  //     if (type === 'remove') {
  //       enqueueSnackbar('Remove from Cart', { variant: 'error' });
  //     } else {
  //       enqueueSnackbar('Added to Cart', { variant: 'success' });
  //     }
  //   };

  return (
    <StyledBazaarCard hoverEffect>
      <ImageWrapper>
        {/* {off !== 0 && (
          <StyledChip color='primary' size='small' label={`${off}% off`} />
        )} */}
        <Link href={`/dish/${slug}`}>
          <LazyImage
            alt={name}
            width={190}
            src={imageUrls[0]}
            height={190}
            layout='responsive'
            objectFit='contain'
          />
        </Link>

        <HoverWrapper className='controller'>
          <Span onClick={toggleDialog}>
            <RemoveRedEye />
          </Span>

          <Span
            onClick={toggleIsFavorite}
            sx={{
              borderLeft: '1px solid',
              borderRight: '1px solid',
              borderColor: 'grey.300',
            }}
          >
            {isFavorite ? (
              <Favorite color='primary' fontSize='small' />
            ) : (
              <FavoriteBorder fontSize='small' color='disabled' />
            )}
          </Span>

          <Span
          // onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}
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

          {/* {!hideRating && (
            <FlexBox gap={1} alignItems='center'>
              <BazaarRating value={rating || 0} color='warn' readOnly />
              <Span color='grey.600'>{`(${rating})`}</Span>
            </FlexBox>
          )} */}

          <FlexBox gap={1} alignItems='center' mt={0.5}>
            <Box fontWeight={600} color='primary.main'>
              {currency(retailPrice)}
            </Box>

            {/* {off !== 0 && (
              <Box color='grey.600' fontWeight={600}>
                <del>{currency(price)}</del>
              </Box>
            )} */}
          </FlexBox>
        </Box>

        <FlexBox
          width='30px'
          alignItems='center'
          className='add-cart'
          flexDirection='column-reverse'
          justifyContent={cartItem?.quantity ? 'space-between' : 'flex-start'}
        >
          <Button
            color='primary'
            variant='outlined'
            sx={{ padding: '3px' }}
            // onClick={handleCartAmountChange((cartItem?.qty || 0) + 1)}
          >
            <Add fontSize='small' />
          </Button>

          {!!cartItem?.quantity && (
            <Fragment>
              <Box color='text.primary' fontWeight='600'>
                {cartItem?.quantity}
              </Box>

              <Button
                color='primary'
                variant='outlined'
                sx={{ padding: '3px' }}
                // onClick={handleCartAmountChange(cartItem?.qty - 1, 'remove')}
              >
                <Remove fontSize='small' />
              </Button>
            </Fragment>
          )}
        </FlexBox>
      </ContentWrapper>
    </StyledBazaarCard>
  );
};

export default ProductCard;
