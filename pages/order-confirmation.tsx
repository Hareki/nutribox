import { Button, Container, styled } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';

import BazaarCard from 'components/BazaarCard';
import ShopLayout2 from 'components/layouts/ShopLayout2';
import LazyImage from 'components/LazyImage';
import SEO from 'components/SEO';
import { H1, Paragraph } from 'components/Typography';

// custom styled components
const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '2rem',
  padding: '11px 24px',
});

const OrderConfirmation: NextPage = () => {
  return (
    <ShopLayout2>
      <SEO title='Order Confirmation' />

      <Container sx={{ mt: 4, mb: 20 }}>
        <Wrapper>
          <LazyImage
            width={116}
            height={116}
            alt='complete'
            src='/assets/images/illustrations/party-popper.svg'
          />
          <H1 lineHeight={1.1} mt='1.5rem'>
            Your order is completed!
          </H1>

          <Paragraph color='grey.800' mt='0.3rem'>
            You will be receiving confirmation email with order details.
          </Paragraph>

          <Link href='/market-1' passHref legacyBehavior>
            <StyledButton
              color='primary'
              disableElevation
              variant='contained'
              className='button-link'
            >
              Browse products
            </StyledButton>
          </Link>
        </Wrapper>
      </Container>
    </ShopLayout2>
  );
};

export default OrderConfirmation;
