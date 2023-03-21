import { Box, Button, Divider, Grid, Radio, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import * as yup from 'yup';

import { Paragraph } from 'components/abstract/Typography';
import Card1 from 'components/common/Card1';
import CardCvcInput from 'components/common/input/CardCvcInput';
import CardExpDateInput from 'components/common/input/CardExpirationDateInput';
import CardNumberInput from 'components/common/input/CardNumberInput';
import MuiImage from 'components/common/input/MuiImage';
import { FlexBox } from 'components/flex-box';
import { nameRegex } from 'helpers/regex.helper';
import useWindowSize from 'hooks/useWindowSize';

const initialValues = {
  card_no: '',
  name: '',
  exp_date: '',
  cvc: '',
};

type FormValues = typeof initialValues;

interface PaymentFormProps {
  prevStep: (currentStep: number) => void;
}
const PaymentForm: FC<PaymentFormProps> = ({ prevStep }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const width = useWindowSize();
  const router = useRouter();
  const isMobile = width < 769;

  const handleFormSubmit = async (values: any) => router.push('/payment');

  const handlePaymentMethodChange = ({ target: { name } }: any) => {
    setPaymentMethod(name);
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
              checked={paymentMethod === 'cod'}
              color='primary'
              size='small'
            />
          }
        />

        <Divider sx={{ mb: 3, mx: -4 }} />

        <FormControlLabel
          name='MoMo'
          sx={{ mb: 3 }}
          onChange={handlePaymentMethodChange}
          label={
            <FlexBox gap={1} alignItems='center'>
              <Paragraph fontWeight={600}>Thanh toán với MoMo</Paragraph>
              <MuiImage
                src='assets/images/payment-card/MoMo.png'
                alt='MoMo'
                height={25}
              />
            </FlexBox>
          }
          control={
            <Radio
              checked={paymentMethod === 'MoMo'}
              color='primary'
              size='small'
            />
          }
        />

        <Divider sx={{ mb: 3, mx: -4 }} />

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

        <FormControlLabel
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
        />

        <Divider sx={{ mb: 3, mx: -4 }} />

        {paymentMethod === 'credit-card' && (
          <Formik<FormValues>
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name='card_no'
                        label='Số thẻ'
                        placeholder='XXXX XXXX XXXX XXXX'
                        onBlur={handleBlur}
                        value={values.card_no}
                        onChange={handleChange}
                        error={!!touched.card_no && !!errors.card_no}
                        helperText={
                          (touched.card_no && errors.card_no) as string
                        }
                        InputProps={{
                          inputComponent: CardNumberInput as any,
                        }}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name='exp_date'
                        label='Ngày hết hạn'
                        placeholder='MM/YY'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.exp_date}
                        error={!!touched.exp_date && !!errors.exp_date}
                        helperText={
                          (touched.exp_date && errors.exp_date) as string
                        }
                        InputProps={{
                          inputComponent: CardExpDateInput as any,
                        }}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name='name'
                        onBlur={handleBlur}
                        value={values.name}
                        label='Tên chủ thẻ'
                        onChange={handleChange}
                        error={!!touched.name && !!errors.name}
                        helperText={(touched.name && errors.name) as string}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name='cvc'
                        placeholder='XXX'
                        onBlur={handleBlur}
                        value={values.cvc}
                        label='CVC/CVV'
                        onChange={handleChange}
                        error={!!touched.cvc && !!errors.cvc}
                        helperText={(touched.cvc && errors.cvc) as string}
                        InputProps={{
                          inputComponent: CardCvcInput as any,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                {/* <Button variant='outlined' color='primary' sx={{ mb: 4 }}>
                  Tiếp tục
                </Button> */}

                <Divider sx={{ mb: 3, mx: -4 }} />
              </form>
            )}
          </Formik>
        )}
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Button
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
          <Link href='/orders' passHref legacyBehavior>
            <Button variant='contained' color='primary' type='submit' fullWidth>
              Thanh toán
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const checkoutSchema = yup.object().shape({
  card_no: yup
    .string()
    .required('Vui lòng nhập mã thẻ')
    .length(16, 'Số thẻ phải đủ 16 số'),
  name: yup
    .string()
    .required('Vui lòng nhập tên chủ thẻ')
    .max(50, 'Tên tối đa 50 ký tự')
    .matches(nameRegex, 'Tên không hợp lệ'),
  exp_date: yup.string().required('Vui lòng nhập ngày hết hạn'),
  cvc: yup
    .string()
    .required('Vui lòng nhập CVC/CVV')
    .length(3, 'CVC/CVV phải đủ 3 số'),
});

export default PaymentForm;
