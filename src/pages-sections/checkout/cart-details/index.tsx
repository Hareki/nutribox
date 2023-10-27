import { LoadingButton } from '@mui/lab';
import { Button, Card, Divider, Grid, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { useEffect } from 'react';
import { Fragment, useReducer, useState } from 'react';

import type { Step1Data } from '../../../../pages/checkout';

import {
  checkCurrentFullAddress,
  checkDistance,
  checkDuration,
  checkTime,
} from './confirmValidation';
import SelectAddressDialog from './SelectAddressDialog';
import { getInitialValues } from './yup';

import apiCaller from 'api-callers/checkout';
import storeApiCaller from 'api-callers/stores';
import {
  CheckoutFormSchema,
  type CheckoutFormValues,
} from 'backend/dtos/checkout.dto';
import type { CheckoutValidation } from 'backend/services/customerOrder/helper';
import { Paragraph, Span } from 'components/abstract/Typography';
import CustomTextField from 'components/common/input/CustomTextField';
import PhoneInput from 'components/common/input/PhoneInput';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import InfoDialog from 'components/dialog/info-dialog';
import {
  infoDialogReducer,
  initInfoDialogState,
} from 'components/dialog/info-dialog/reducer';
import { FlexBetween, FlexBox } from 'components/flex-box';
import ProductCartItem from 'components/product-item/ProductCartItem';
import { STORE_ID } from 'constants/temp.constant';
import { getFullAddress2 } from 'helpers/address.helper';
import {
  transformAccountAddressToFormikValue,
  transformFormikValueToIAddress,
} from 'helpers/address.helper';
import useCart from 'hooks/global-states/useCart';
import { useAddressQuery } from 'hooks/useAddressQuery';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useGlobalQuantityLimitation } from 'hooks/useGlobalQuantityLimitation';
import { formatCurrency, formatDateTime } from 'lib';
import type { CommonCustomerAccountModel } from 'models/account.model';
import type { CustomerAddressModel } from 'models/customerAddress.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

interface CartDetailsProps {
  nextStep: (data: Step1Data, currentStep: number) => void;
  account: CommonCustomerAccountModel;
}

function CartDetails({ account, nextStep }: CartDetailsProps): ReactElement {
  const addresses = account.customer.customerAddresses;

  const [checkoutValidation, setCheckoutValidation] =
    useState<CheckoutValidation>();
  const [currentFullAddress, setCurrentFullAddress] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [selectAddressDialogOpen, setSelectAddressDialogOpen] = useState(false);
  const { cartItems } = useCart();
  const { hasOverLimitItem, hasUnavailableItem } =
    useGlobalQuantityLimitation();
  const [infoState, dispatchInfo] = useReducer(
    infoDialogReducer,
    initInfoDialogState,
  );
  const [confirmState, dispatchConfirm] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );

  const { data: storeInfo, isLoading: isLoadingStoreInfo } = useQuery({
    queryKey: ['store', STORE_ID],
    queryFn: () => storeApiCaller.getStoreInfo(STORE_ID),
  });

  const { t } = useCustomTranslation(['customerOrder']);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (accumulate, item) =>
          accumulate + item.product.retailPrice * item.quantity,
        0,
      ),
    [cartItems],
  );

  const showDeliveryInfoConfirmation = async (
    checkoutValidation: CheckoutValidation,
  ) => {
    if (
      !checkTime(dispatchInfo, storeInfo!) ||
      !checkCurrentFullAddress(dispatchInfo, currentFullAddress)
    ) {
      return;
    }

    const {
      estimatedDeliveryInfo: { deliveryTime, distance, heavyTraffic },
    } = checkoutValidation;

    if (!checkDistance(dispatchInfo, distance)) return;
    if (!checkDuration(dispatchInfo, deliveryTime)) return;

    const confirmContent = (
      <Fragment>
        <Paragraph>
          Vui lòng đọc và xác nhận thời gian giao hàng dự kiến dưới đây:
        </Paragraph>
        <ul
          style={{
            listStyle: 'inside',
            marginLeft: 20,
          }}
        >
          <li>
            Quãng đường: <Span fontWeight={600}>{distance} km</Span>
          </li>
          <li>
            Thời gian giao hàng dự kiến:{' '}
            <Span fontWeight={600}>{formatDateTime(deliveryTime)}</Span>
          </li>
        </ul>
        {heavyTraffic && (
          <Paragraph color='grey.600' fontStyle='italic' mt={2} fontSize={13}>
            Lưu ý: Thời gian giao hàng lâu hơn thông thường do tình trạng giao
            thông ùn tắc, xin quý khách thông cảm vì sự bất tiện này.
          </Paragraph>
        )}
      </Fragment>
    );

    dispatchConfirm({
      type: 'open_dialog',
      payload: {
        content: confirmContent,
        title: 'Xác nhận thời gian giao hàng',
      },
    });
  };

  const handleFormSubmit = async (values: CheckoutFormValues) => {
    console.log(values);

    // if (isLoadingStoreInfo || !currentFullAddress) return;

    setIsEstimating(true);
    apiCaller
      .getCheckoutValidation(currentFullAddress)
      .then((checkoutValidationResponse) => {
        setIsEstimating(false);
        setCheckoutValidation(checkoutValidationResponse);
        showDeliveryInfoConfirmation(checkoutValidationResponse);
      });
  };

  const handleSelectAddress = async (address: CustomerAddressModel) => {
    setSelectAddressDialogOpen(false);
    const transformedAddress =
      await transformAccountAddressToFormikValue(address);
    for (const key in transformedAddress) {
      setFieldValue(
        key,
        transformedAddress[key as keyof typeof transformedAddress],
      );
    }
  };

  const handleNextStep = () => {
    const address = transformFormikValueToIAddress(values);
    console.log('file: index.tsx:176 - handleNextStep - address:', address);
    if (!address) return;

    const {
      estimatedDeliveryInfo: { distance, deliveryTime },
    } = checkoutValidation!;

    const note = values.note;
    const phone = values.phone;

    nextStep(
      {
        // FIXME should let the user select which items to buy
        selectedCartItems: cartItems,
        note,
        phone,
        address,
        total,
        deliveryTime,
        distance,
      },
      1,
    );
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik<CheckoutFormValues>({
    initialValues: getInitialValues(account),
    onSubmit: handleFormSubmit,
    validationSchema: toFormikValidationSchema(CheckoutFormSchema),
  });

  useEffect(() => {
    const address = transformFormikValueToIAddress(values);
    setCurrentFullAddress(getFullAddress2(address));
  }, [values, touched, errors]);

  const handleTouchedBlur = (fieldName: string) => {
    return () => {
      setFieldTouched(fieldName, true);
    };
  };

  const {
    provinces,
    isLoadingProvince,
    districts,
    isLoadingDistricts,
    wards,
    isLoadingWards,
    hasDistrict,
    hasProvince,
  } = useAddressQuery(values);

  return (
    <Fragment>
      <Grid container spacing={3}>
        {/* CART PRODUCT LIST */}
        <Grid item md={8} xs={12}>
          {cartItems.map((item) => (
            <ProductCartItem
              key={item.product.id}
              productId={item.product.id}
            />
          ))}
        </Grid>
        {/* CHECKOUT FORM */}
        <Grid item md={4} xs={12}>
          <form onSubmit={handleSubmit}>
            <Card sx={{ padding: 3 }}>
              <FlexBetween mb={2}>
                <Span color='grey.600'>Tổng tiền:</Span>

                <Span fontSize={18} fontWeight={600} lineHeight='1'>
                  {formatCurrency(total)}
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
                helperText={t((touched.note && errors.note) as string)}
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
                helperText={t((touched.phone && errors.phone) as string)}
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
                mb={3}
                justifyContent='space-between'
              >
                <Span fontWeight={600} display='block'>
                  Địa chỉ giao hàng
                </Span>

                <Button
                  onClick={() => setSelectAddressDialogOpen(true)}
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
                getOptionLabel={(option) => (option as any).name}
                onChange={(_, value) => {
                  setFieldValue('province', value);
                  setFieldValue('district', null);
                  setFieldValue('ward', null);
                }}
                onBlur={handleTouchedBlur('province')}
                renderInput={(params) => (
                  <TextField
                    label='Tỉnh/Thành phố'
                    placeholder='Chọn Tỉnh/Thành phố'
                    error={!!touched.province && !!errors.province}
                    helperText={t(
                      (touched.province && errors.province) as string,
                    )}
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
                getOptionLabel={(option) => (option as any).name}
                onChange={(_, value) => {
                  setFieldValue('district', value);
                  setFieldValue('ward', null);
                }}
                onBlur={handleTouchedBlur('district')}
                renderInput={(params) => (
                  <TextField
                    label='Quận/Huyện'
                    placeholder='Chọn Quận/Huyện'
                    error={!!touched.district && !!errors.district}
                    helperText={t(
                      (touched.district && errors.district) as string,
                    )}
                    {...params}
                  />
                )}
              />

              <Autocomplete
                fullWidth
                sx={{ mb: 3 }}
                options={wards || ([] as any[])}
                disabled={!hasDistrict || isLoadingWards}
                value={values.ward}
                getOptionLabel={(option) => (option as any).name}
                onChange={(_, value) => setFieldValue('ward', value)}
                onBlur={handleTouchedBlur('province')}
                renderInput={(params) => (
                  <TextField
                    label='Phường/Xã'
                    placeholder='Chọn Phường/Xã'
                    error={!!touched.ward && !!errors.ward}
                    helperText={t((touched.ward && errors.ward) as string)}
                    {...params}
                  />
                )}
              />

              <TextField
                fullWidth
                sx={{ mb: 4 }}
                name='streetAddress'
                label='Số nhà, tên đường'
                onBlur={handleBlur}
                value={values.streetAddress}
                onChange={handleChange}
                error={!!touched.streetAddress && !!errors.streetAddress}
                helperText={t(
                  (touched.streetAddress && errors.streetAddress) as string,
                )}
              />

              <LoadingButton
                disabled={
                  hasOverLimitItem ||
                  hasUnavailableItem ||
                  cartItems.length === 0 ||
                  isLoadingStoreInfo
                }
                loading={isEstimating}
                variant='contained'
                color='primary'
                fullWidth
                type='submit'
              >
                Thanh toán ngay
              </LoadingButton>
            </Card>
          </form>
        </Grid>
      </Grid>
      <InfoDialog
        open={infoState.open}
        content={infoState.content}
        title={infoState.title}
        variant={infoState.variant}
        handleClose={() => dispatchInfo({ type: 'close_dialog' })}
      />

      <ConfirmDialog
        open={confirmState.open}
        content={confirmState.content}
        title={confirmState.title}
        handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
        handleConfirm={handleNextStep}
      />

      <SelectAddressDialog
        addresses={addresses}
        open={selectAddressDialogOpen}
        setOpen={setSelectAddressDialogOpen}
        onSelectAddress={handleSelectAddress}
      />
    </Fragment>
  );
}

export default CartDetails;
