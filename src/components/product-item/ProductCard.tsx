// Product Card 13
import { Add, Remove, RemoveRedEye } from '@mui/icons-material';
import ShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Box, Button, styled } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { FC, Fragment, useCallback, useState } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import BazaarCard from 'components/BazaarCard';
import { FlexBetween, FlexBox } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import ProductViewDialog from 'components/products/ProductViewDialog';
import { H3, Span } from 'components/Typography';
import { CartItem, useAppContext } from 'contexts/AppContext';
import { currency } from 'lib';

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
    '&:hover': { cursor: 'pointer', background: '#f3f5f9' },
  },
  '& span': { padding: '0px 10px' },
  '& svg': { fontSize: 18, color: theme.palette.grey[600] },
}));

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
    product: { id, imageUrls, retailPrice, name, slug },
    onPreview,
  } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);

  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const toggleDialog = useCallback(() => {
    onPreview?.();
    setOpenModal((open) => !open);
  }, [onPreview]);

  const cartItem: CartItem | undefined = state.cart.find(
    (item) => item.id === id,
  );

  const handleCartAmountChange = (amount: number, type?: 'add' | 'remove') => {
    dispatch({
      type: 'CHANGE_CART_AMOUNT',
      payload: { ...props.product, quantity: amount },
    });

    if (type === 'remove') {
      enqueueSnackbar('Remove from Cart', { variant: 'error' });
    } else {
      enqueueSnackbar('Added to Cart', { variant: 'success' });
    }
  };

  const handleCartAmountButtonClick = (type: 'add' | 'remove') => {
    if (isAuthenticated) {
      const quantity = type === 'add' ? 1 : -1;
      handleCartAmountChange((cartItem?.quantity || 0) + quantity, type);
    } else {
      enqueueSnackbar('Please Login to add product to cart', {
        variant: 'error',
      });
    }
  };

  return (
    <StyledBazaarCard hoverEffect>
      <ImageWrapper>
        <Link href={`/product/${slug}`}>
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

          <FlexBox gap={1} alignItems='center' mt={0.5}>
            <Box fontWeight={600} color='primary.main'>
              {currency(retailPrice)}
            </Box>
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
            onClick={() => handleCartAmountButtonClick('add')}
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
                onClick={() => handleCartAmountButtonClick('remove')}
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
