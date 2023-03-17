import { Button, Card, Divider, Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import type { NextPage } from 'next';
import Link from 'next/link';

import SEO from 'components/abstract/SEO';
import { Span } from 'components/abstract/Typography';
import { FlexBetween, FlexBox } from 'components/flex-box';
import CheckoutNavLayout from 'components/layouts/CheckoutNavLayout';
import ProductCartItem from 'components/product-item/ProductCartItem';
import countryList from 'data/countryList';
import useCart from 'hooks/redux-hooks/useCart';
import { currency } from 'lib';

const Cart: NextPage = () => {
  const { cartState } = useCart();
  const cartList = cartState.cart;

  const getTotalPrice = () =>
    cartList.reduce(
      (accumulate, item) =>
        accumulate + item.product.retailPrice * item.quantity,
      0,
    );

  return (
    <CheckoutNavLayout>
      <SEO title='Cart' />

      <Grid container spacing={3}>
        {/* CART PRODUCT LIST */}
        <Grid item md={8} xs={12}>
          {cartList.map((item) => (
            <ProductCartItem key={item.id} {...item} />
          ))}
        </Grid>

        {/* CHECKOUT FORM */}
        <Grid item md={4} xs={12}>
          <Card sx={{ padding: 3 }}>
            <FlexBetween mb={2}>
              <Span color='grey.600'>Total:</Span>

              <Span fontSize={18} fontWeight={600} lineHeight='1'>
                {currency(getTotalPrice())}
              </Span>
            </FlexBetween>

            <Divider sx={{ mb: 2 }} />

            <FlexBox alignItems='center' columnGap={1} mb={2}>
              <Span fontWeight='600'>Additional Comments</Span>

              <Span
                p='6px 10px'
                fontSize={12}
                lineHeight='1'
                borderRadius='3px'
                color='primary.main'
                bgcolor='primary.light'
              >
                Note
              </Span>
            </FlexBox>

            <TextField
              variant='outlined'
              rows={6}
              fullWidth
              multiline
              sx={{ mb: 2 }}
            />

            <Divider sx={{ mb: 2 }} />

            <TextField
              fullWidth
              size='small'
              label='Voucher'
              variant='outlined'
              placeholder='Voucher'
            />

            <Button
              variant='outlined'
              color='primary'
              fullWidth
              sx={{ mt: 2, mb: 4 }}
            >
              Apply Voucher
            </Button>

            <Divider sx={{ mb: 2 }} />

            <Span fontWeight={600} mb={2} display='block'>
              Shipping Estimates
            </Span>

            <Autocomplete
              fullWidth
              sx={{ mb: 2 }}
              options={countryList}
              // getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size='small'
                  label='Country'
                  variant='outlined'
                  placeholder='Select Country'
                />
              )}
            />

            <TextField
              select
              fullWidth
              size='small'
              label='State'
              variant='outlined'
              placeholder='Select State'
              defaultValue='new-york'
            >
              {stateList.map((item) => (
                <MenuItem value={item.value} key={item.label}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              size='small'
              label='Zip Code'
              placeholder='3100'
              variant='outlined'
              sx={{ mt: 2 }}
            />

            <Button variant='outlined' color='primary' fullWidth sx={{ my: 2 }}>
              Calculate Shipping
            </Button>

            <Link href='/checkout' passHref legacyBehavior>
              <Button variant='contained' color='primary' fullWidth>
                Checkout Now
              </Button>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};

const stateList = [
  { value: 'new-york', label: 'New York' },
  { value: 'chicago', label: 'Chicago' },
];

export default Cart;
