import { Button, Container, Divider, styled } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';

import type { Step2Data } from '../../../../pages/checkout';

import checkoutApiCaller from 'api-callers/checkout';
import type { PayPalDto } from 'backend/dtos/payPal.dto';
import SEO from 'components/abstract/SEO';
import { H1, Paragraph } from 'components/abstract/Typography';
import BazaarCard from 'components/common/BazaarCard';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import { FlexBox } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import PayPalButton from 'components/PayPalButton';
import { HOME_PAGE_ROUTE, ORDERS_ROUTE } from 'constants/routes.ui.constant';
import type { CustomerOrderModel } from 'models/customerOrder.model';

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

type Props = {
  step2Data: Step2Data;
};

const OrderCompleted: React.FC<Props> = ({ step2Data }) => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [trackingContent, setTrackingContent] = useState('Theo dõi đơn hàng');
  const [shoppingContent, setShoppingContent] = useState('Tiếp tục mua sắm');
  const [alreadyPaid, setAlreadyPaid] = useState(false);

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
  const { mutate: updateOnlinePayment, isLoading: isUpdatingOnlinePayment } =
    useMutation<CustomerOrderModel, unknown, PayPalDto>({
      mutationFn: checkoutApiCaller.updateOnlinePayment,
      onSuccess: () => {
        setAlreadyPaid(true);
      },
    });

  const { data: usdPrice, isLoading: isGettingUsdPrice } = useQuery({
    queryKey: ['paypal', step2Data.orderId],
    cacheTime: 0,
    queryFn: () => checkoutApiCaller.getUsdPrice(step2Data.orderPrice),
  });

  return (
    <Fragment>
      <SEO title='Đặt hàng thành công' />

      <Container sx={{ mt: 6, mb: 20 }}>
        <Wrapper>
          {isUpdatingOnlinePayment ? (
            <CircularProgressBlock />
          ) : (
            <>
              <LazyImage
                width={116}
                height={116}
                alt='complete'
                src='/assets/images/illustrations/party-popper.svg'
              />
              <H1 lineHeight={1.1} mt='1.5rem'>
                {alreadyPaid ? 'Thanh toán thành công' : 'Đặt hàng thành công'}
              </H1>

              <Paragraph color='grey.800' mt='0.3rem'>
                Bạn có thể theo dõi tình trạng đơn hàng hoặc tiếp tục mua sắm
                ngay bây giờ
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

              {!alreadyPaid && step2Data.payWithPayPal && (
                <FlexBox mt={2} justifyContent='center'>
                  <div>
                    <Divider sx={{ mx: -4, my: 2, borderColor: 'grey.400' }} />
                    <Paragraph
                      fontSize={13}
                      mb={1}
                      fontWeight={600}
                      fontStyle='italic'
                    >
                      Tiến hành thanh toán
                    </Paragraph>
                    {isGettingUsdPrice && (
                      <CircularProgressBlock height='fit-content' />
                    )}
                    {usdPrice && (
                      <PayPalButton
                        usdPrice={usdPrice}
                        orderId={step2Data.orderId}
                        updateOnlinePayment={updateOnlinePayment}
                      />
                    )}
                  </div>
                </FlexBox>
              )}
            </>
          )}
        </Wrapper>
      </Container>
    </Fragment>
  );
};

export default OrderCompleted;
