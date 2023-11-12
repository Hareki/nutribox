import { LoadingButton } from '@mui/lab';
import { Button, Divider, Grid, Radio } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { FC, Dispatch, SetStateAction } from 'react';
import { Fragment } from 'react';

import { PaymentMethod } from 'backend/enums/entities.enum';
import { Paragraph } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import MuiImage from 'components/common/input/MuiImage';
import { FlexBox } from 'components/flex-box';

interface PaymentFormProps {
  prevStep: (currentStep: number) => void;
  completeOrder: () => void;
  isLoading: boolean;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  paymentMethod: PaymentMethod;
}
const PaymentForm: FC<PaymentFormProps> = ({
  prevStep,
  completeOrder,
  isLoading,
  paymentMethod,
  setPaymentMethod,
}) => {
  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    switch (name) {
      case 'cod':
        setPaymentMethod(PaymentMethod.COD);
        break;
      case 'PayPal':
        setPaymentMethod(PaymentMethod.PayPal);
        break;
      default:
        setPaymentMethod(PaymentMethod.PayPal);
        break;
    }
  };

  const handleCheckout = () => {
    // const paid = paymentMethod === 'cod' ? false : true;
    completeOrder();
  };

  return (
    <Fragment>
      <Card1 sx={{ mb: 4 }}>
        <FormControlLabel
          name='cod'
          onChange={handlePaymentMethodChange}
          label={
            <Paragraph fontWeight={600}>Thanh toán khi nhận hàng</Paragraph>
          }
          control={
            <Radio
              checked={paymentMethod === PaymentMethod.COD}
              color='primary'
              size='small'
            />
          }
        />

        <Divider sx={{ mb: 3, mx: -4 }} />

        <FormControlLabel
          name='PayPal'
          sx={{ mb: 3 }}
          onChange={handlePaymentMethodChange}
          label={
            <FlexBox gap={1} alignItems='center'>
              <Paragraph fontWeight={600}>Thanh toán với PayPal</Paragraph>
              <MuiImage
                src='assets/images/payment-card/PayPal.png'
                alt='PayPal'
                height={20}
              />
            </FlexBox>
          }
          control={
            <Radio
              checked={paymentMethod === 'PayPal'}
              color='primary'
              size='small'
            />
          }
        />

        {/* <Divider sx={{ mb: 3, mx: -4 }} /> */}

        {/* {paymentMethod === 'MoMo' && (
          <Fragment>
            <FlexBox alignItems='flex-end' mb={4}>
              <Button variant='outlined' color='primary' type='button'>
                Quét mã
              </Button>
            </FlexBox>

            <Divider sx={{ mb: 3, mx: -4 }} />
          </Fragment>
        )} */}

        {/* <FormControlLabel
          sx={{ mb: 3 }}
          name='credit-card'
          onChange={handlePaymentMethodChange}
          label={
            <FlexBox gap={1} alignItems='center'>
              <Paragraph fontWeight={600}>
                Thanh toán với thẻ tín dụng
              </Paragraph>
              <MuiImage
                src='assets/images/payment-card/credit-cards.png'
                alt='credit cards'
                height={35}
              />
            </FlexBox>
          }
          control={
            <Radio
              checked={paymentMethod === 'credit-card'}
              color='primary'
              size='small'
            />
          }
        /> */}

        {/* <Divider sx={{ mb: 3, mx: -4 }} /> */}
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Button
            disabled={isLoading}
            variant='outlined'
            color='primary'
            type='button'
            fullWidth
            onClick={() => prevStep(2)}
          >
            Chỉnh sửa chi tiết đơn hàng
          </Button>
        </Grid>

        <Grid item sm={6} xs={12}>
          <LoadingButton
            onClick={() => handleCheckout()}
            loading={isLoading}
            variant='contained'
            color='primary'
            type='submit'
            fullWidth
          >
            Thanh toán
          </LoadingButton>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default PaymentForm;
