import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useFormik } from 'formik';
import type { ReactElement } from 'react';
import { Fragment, useReducer, useState } from 'react';
import * as yup from 'yup';

import SEO from 'components/abstract/SEO';
import { Paragraph, Span } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import PhoneInput from 'components/common/input/PhoneInput';
import InfoDialog from 'components/dialog/info-dialog';
import { infoDialogReducer } from 'components/dialog/info-dialog/reducer';
import { FlexBetween, FlexBox } from 'components/flex-box';
import PageLayout from 'components/layouts/PageLayout';
import ProductCartItem from 'components/product-item/ProductCartItem';
import Stepper from 'components/Stepper';
import { phoneRegex } from 'helpers/regex.helper';
import useCart from 'hooks/redux-hooks/useCart';
import { useAddressQuery } from 'hooks/useAddressQuery';
import { calculateEndTime, formatCurrency, formatDateTime } from 'lib';
import apiCaller from 'utils/apiCallers/checkout';
import { PREPARATION_TIME } from 'utils/constants';

Cart.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

function Cart() {
  const [selectedStep, setSelectedStep] = useState(0);
  const nextStep = () => setSelectedStep((prev) => prev + 1);
  const prevStep = () => setSelectedStep((prev) => prev - 1);

  const { cartState } = useCart();
  const [state, dispatch] = useReducer(infoDialogReducer, { open: false });
  const cartList = cartState.cart;

  const getTotalPrice = () =>
    cartList.reduce(
      (accumulate, item) =>
        accumulate + item.product.retailPrice * item.quantity,
      0,
    );

  const handleDeliveryInfoRequest = async () => {
    const deliveryInfo = await apiCaller.getDeliveryInfo(
      '12 Đ. 12, P. Bình An, Quận 2, Thành phố Hồ Chí Minh, Vietnam',
      'Landmark 81 Skyscraper, Nguyễn Hữu Cảnh, Bình Thạnh, Thành phố Hồ Chí Minh, Vietnam',
    );

    const estimatedTime = formatDateTime(
      calculateEndTime(PREPARATION_TIME + deliveryInfo.durationInTraffic),
    );

    const content = (
      <Fragment>
        <ul>
          <li>
            Quãng đường:{' '}
            <Span fontWeight={600}>{deliveryInfo.distance} km</Span>
          </li>
          <li>
            Thời gian giao hàng dự kiến:{' '}
            <Span fontWeight={600}>{estimatedTime}</Span>
          </li>
        </ul>
        {deliveryInfo.heavyTraffic && (
          <Paragraph color='error.400' fontStyle='italic' mt={2}>
            Thời gian giao hàng lâu hơn thông thường do tình trạng giao thông ùn
            tắc, xin quý khách thông cảm vì sự bất tiện này.
          </Paragraph>
        )}
      </Fragment>
    );

    dispatch({
      type: 'open_dialog',
      payload: {
        content,
        title: 'Thông tin vận chuyển',
        variant: 'info',
      },
    });
  };

  const handleFormSubmit = (values: any) => {
    console.log(values);
    dispatch({
      type: 'open_dialog',
      payload: {
        content: 'Đặt hàng thành công',
        title: 'Thông báo',
        variant: 'info',
      },
    });
  };

  const initialValues = {
    note: '',
    phone: '',
    province: null,
    district: null,
    ward: null,
    streetAddress: '',
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema,
  });

  const hasProvince = values.province !== null;
  const hasDistrict = values.district !== null;

  const {
    provinces,
    isLoadingProvince,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
  } = useAddressQuery(values, hasProvince, hasDistrict);

  return (
    <Container sx={{ my: 4 }}>
      <Box mb={3} display={{ sm: 'block', xs: 'none' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stepper stepperList={stepperList} selectedStep={selectedStep} />
          </Grid>
        </Grid>
      </Box>

      <SEO title='Thanh toán' />

      <Grid container spacing={3}>
        {/* CART PRODUCT LIST */}
        <Grid item md={8} xs={12}>
          {cartList.map((item) => (
            <ProductCartItem key={item.id} {...item} />
          ))}
        </Grid>
        {/* CHECKOUT FORM */}
        <Grid item md={4} xs={12}>
          <form onSubmit={handleSubmit}>
            <Card sx={{ padding: 3 }}>
              <FlexBetween mb={2}>
                <Span color='grey.600'>Tổng tiền:</Span>

                <Span fontSize={18} fontWeight={600} lineHeight='1'>
                  {formatCurrency(getTotalPrice())}
                </Span>
              </FlexBetween>

              <Divider sx={{ mb: 2 }} />

              <FlexBox alignItems='center' columnGap={1} mb={1}>
                <Span fontWeight='600'>Lời nhắn</Span>
              </FlexBox>

              <TextField
                variant='outlined'
                name='note'
                value={values.note}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.note && !!errors.note}
                helperText={(touched.note && errors.note) as string}
                rows={6}
                fullWidth
                multiline
                sx={{ mb: 2 }}
              />

              <Divider sx={{ mb: 2 }} />

              <FlexBox alignItems='center' columnGap={1} mb={1}>
                <Span fontWeight='600'>Số điện thoại</Span>
              </FlexBox>

              <CustomTextField
                fullWidth
                name='phone'
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!touched.phone && !!errors.phone}
                helperText={(touched.phone && errors.phone) as string}
                size='small'
                variant='outlined'
                placeholder='Dùng để liên hệ khi giao hàng'
                InputProps={{
                  inputComponent: PhoneInput as any,
                }}
              />

              <Divider sx={{ my: 2 }} />

              <FlexBox
                alignItems='center'
                columnGap={1}
                mb={1}
                justifyContent='space-between'
              >
                <Span fontWeight={600} display='block'>
                  Địa chỉ giao hàng
                </Span>

                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  sx={{
                    lineHeight: 1.2,
                  }}
                >
                  Chọn
                </Button>
              </FlexBox>

              <Autocomplete
                fullWidth
                sx={{ mb: 3 }}
                options={provinces || []}
                disabled={isLoadingProvince}
                value={values.province}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                  setFieldValue('province', value);
                  setFieldValue('district', null);
                  setFieldValue('ward', null);
                }}
                renderInput={(params) => (
                  <TextField
                    label='Tỉnh/Thành phố'
                    placeholder='Chọn Tỉnh/Thành phố'
                    error={!!touched.province && !!errors.province}
                    helperText={(touched.province && errors.province) as string}
                    {...params}
                  />
                )}
              />

              <Autocomplete
                fullWidth
                sx={{ mb: 3 }}
                options={districts || []}
                disabled={!hasProvince || isLoadingDistricts}
                value={values.district}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => {
                  setFieldValue('district', value);
                  setFieldValue('ward', null);
                }}
                renderInput={(params) => (
                  <TextField
                    label='Quận/Huyện'
                    placeholder='Chọn Quận/Huyện'
                    error={!!touched.district && !!errors.district}
                    helperText={(touched.district && errors.district) as string}
                    {...params}
                  />
                )}
              />

              <Autocomplete
                fullWidth
                sx={{ mb: 3 }}
                options={wards || []}
                disabled={!hasDistrict || isLoadingWards}
                value={values.ward}
                getOptionLabel={(option) => option.name}
                onChange={(_, value) => setFieldValue('ward', value)}
                renderInput={(params) => (
                  <TextField
                    label='Phường/Xã'
                    placeholder='Chọn Phường/Xã'
                    error={!!touched.ward && !!errors.ward}
                    helperText={(touched.ward && errors.ward) as string}
                    {...params}
                  />
                )}
              />

              <TextField
                fullWidth
                sx={{ mb: 2 }}
                name='streetAddress'
                label='Số nhà, tên đường'
                onBlur={handleBlur}
                value={values.streetAddress}
                onChange={handleChange}
                error={!!touched.streetAddress && !!errors.streetAddress}
                helperText={
                  (touched.streetAddress && errors.streetAddress) as string
                }
              />

              <Button
                onClick={() => handleDeliveryInfoRequest()}
                variant='outlined'
                color='primary'
                fullWidth
                sx={{ mb: 5 }}
              >
                Xem thông tin vận chuyển
              </Button>

              <Button
                variant='contained'
                color='primary'
                fullWidth
                type='submit'
              >
                Thanh toán ngay
              </Button>
            </Card>
          </form>
        </Grid>
      </Grid>
      <InfoDialog
        open={state.open}
        content={state.content}
        title={state.title}
        variant={state.variant}
        handleClose={() => dispatch({ type: 'close_dialog' })}
      />
    </Container>
  );
}

const formSchema = yup.object().shape({
  note: yup.string().max(500, 'Lời nhắn không được quá 500 ký tự'),
  phone: yup
    .string()
    .transform((value, originalValue) => {
      if (originalValue && typeof originalValue === 'string') {
        return originalValue.replace(/-/g, '');
      }
      return value;
    })
    .matches(phoneRegex, 'Định dạng số điện thoại không hợp lệ'),
  province: yup
    .object()
    .typeError('Vui lòng nhập Tỉnh/Thành Phố')
    .required('Vui lòng nhập Tỉnh/Thành Phố'),
  district: yup
    .object()
    .typeError('Vui lòng nhập Quận/Huyện')
    .required('Vui lòng nhập Quận/Huyện'),
  ward: yup
    .object()
    .typeError('Vui lòng nhập Phường/Xã')
    .required('Vui lòng nhập Phường/Xã'),
  streetAddress: yup.string().required('Vui lòng nhập Số nhà, tên đường'),
});

const stepperList = [
  { title: 'Chi tiết đơn hàng', disabled: false },
  { title: 'Thanh toán', disabled: false },
];

export default Cart;
