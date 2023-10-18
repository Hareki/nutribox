import { Button, Container, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import { FlexBox } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import { HOME_PAGE_ROUTE, ORDERS_ROUTE } from 'constants/routes.ui.constant';

// custom styled components
const Wrapper = styled(BazaarCard)({
  margin: 'auto',
  padding: '3rem',
  maxWidth: '630px',
  textAlign: 'center',
});

const StyledButton = styled(Button)({
  marginTop: '2rem',
  padding: '8px 16px',
});

function OrderCompleted() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [trackingContent, setTrackingContent] = useState('Theo dõi đơn hàng');
  const [shoppingContent, setShoppingContent] = useState('Tiếp tục mua sắm');

  const handleClick = (type: 'tracking' | 'shopping') => {
    setRedirecting(true);

    if (type === 'tracking') {
      setTrackingContent('Đang chuyển hướng...');
      router.replace(ORDERS_ROUTE);
      return;
    }

    setShoppingContent('Đang chuyển hướng...');
    router.replace(HOME_PAGE_ROUTE);
  };
  return (
    <Fragment>
      <SEO title='Đặt hàng thành công' />

      <Container sx={{ mt: 6, mb: 20 }}>
        <Wrapper>
          <LazyImage
            width={116}
            height={116}
            alt='complete'
            src='/assets/images/illustrations/party-popper.svg'
          />
          <H1 lineHeight={1.1} mt='1.5rem'>
            Đặt hàng thành công
          </H1>

          <Paragraph color='grey.800' mt='0.3rem'>
            Bạn có thể theo dõi tình trạng đơn hàng hoặc tiếp tục mua sắm ngay
            bây giờ
          </Paragraph>

          <FlexBox gap={2} justifyContent='center'>
            <StyledButton
              disabled={redirecting}
              onClick={() => handleClick('tracking')}
              color='primary'
              disableElevation
              variant='outlined'
              className='button-link'
            >
              {trackingContent}
            </StyledButton>

            <StyledButton
              disabled={redirecting}
              onClick={() => handleClick('shopping')}
              color='primary'
              disableElevation
              variant='contained'
              className='button-link'
            >
              {shoppingContent}
            </StyledButton>
          </FlexBox>
        </Wrapper>
      </Container>
    </Fragment>
  );
}

export default OrderCompleted;
