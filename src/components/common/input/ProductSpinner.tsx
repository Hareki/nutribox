// Product Card 13
import { Add, Remove } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { Fragment } from 'react';
import type { FC } from 'react';

import { FlexBox } from 'components/flex-box';
import type { CartItemActionType } from 'hooks/global-states/useCart';

type Props = {
  quantity: number | undefined;
  disabledAddToCart: boolean;
  handleCartAmountChange: (amount: number, type: CartItemActionType) => void;
  direction: 'vertical' | 'horizontal';
};

const ProductSpinner: FC<Props> = ({
  quantity,
  disabledAddToCart,
  handleCartAmountChange,
  direction,
}) => {
  return (
    <FlexBox
      width={direction === 'vertical' ? '30px' : '100px'}
      alignItems='center'
      className='add-cart'
      flexDirection={
        direction === 'vertical' ? 'column-reverse' : 'row-reverse'
      }
      justifyContent={quantity ? 'space-between' : 'flex-start'}
    >
      <Button
        disabled={disabledAddToCart}
        color='primary'
        variant='outlined'
        sx={{ padding: '3px', borderRadius: '50%' }}
        onClick={() => handleCartAmountChange((quantity || 0) + 1, 'add')}
      >
        <Add fontSize='small' />
      </Button>

      {!!quantity && (
        <Fragment>
          <Box color='text.primary' fontWeight='600'>
            {quantity}
          </Box>

          <Button
            color='primary'
            variant='outlined'
            sx={{ padding: '3px', borderRadius: '50%' }}
            onClick={() => handleCartAmountChange(quantity - 1, 'remove')}
          >
            <Remove fontSize='small' />
          </Button>
        </Fragment>
      )}
    </FlexBox>
  );
};

export default ProductSpinner;
