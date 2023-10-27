import { Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import type { Step1Data } from '../../../../pages/checkout';

import PaymentForm from './PaymentForm';
import PaymentSummary from './PaymentSummary';

import apiCaller from 'api-callers/checkout';
import type { CheckoutDto } from 'backend/dtos/checkout.dto';
import type { CommonCartItem } from 'backend/services/product/helper';
import PageLayout from 'components/layouts/PageLayout';
import { HOME_PAGE_ROUTE } from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import { useServerSideErrorDialog } from 'hooks/useServerErrorDialog';
import type { CommonCustomerAccountModel } from 'models/account.model';
import type { CustomerOrderModel } from 'models/customerOrder.model';
import type { Id } from 'types/common';

Payment.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

interface PaymentProps {
  step1Data: Step1Data;
  prevStep: (currentStep: number) => void;
  nextStep: (data: undefined, currentStep: number) => void;
  account: CommonCustomerAccountModel;
}

function Payment({
  prevStep,
  nextStep,
  account,
  step1Data,
}: PaymentProps): ReactElement {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { t } = useCustomTranslation(['customerOrder']);
  const { ErrorDialog, dispatchErrorDialog } = useServerSideErrorDialog({
    t,
    operationName: 'Đặt hàng',
    onClose() {
      router.push(HOME_PAGE_ROUTE);
    },
  });
  const { mutate: completeOrder, isLoading } = useMutation<
    CustomerOrderModel,
    unknown
  >({
    mutationFn: () => {
      const { note, address, phone, selectedCartItems } = step1Data;

      const allCartItems = queryClient.getQueryData([
        'cart',
        account.customer.id,
      ]) as (CommonCartItem & Id)[];
      const selectedProductIds = selectedCartItems.map(
        (item) => item.product.id,
      );
      const selectedCartItemIds = allCartItems
        .filter((item) => selectedProductIds.includes(item.product.id))
        .map((item) => item.id);

      const dto: CheckoutDto = {
        cartItems: selectedCartItemIds,
        note,
        phone: phone.replace(/-/g, ''),
        ...address,
      };

      return apiCaller.checkout(dto);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['cart', account.customer.id]);
      nextStep(undefined, 2);
    },
    onError: dispatchErrorDialog,
  });
  return (
    <>
      <Grid container flexWrap='wrap-reverse' spacing={4}>
        <Grid item lg={7.5} md={7.5} xs={12}>
          <PaymentForm
            prevStep={prevStep}
            completeOrder={completeOrder}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item lg={4.5} md={4.5} xs={12}>
          <PaymentSummary step1Data={step1Data} />
        </Grid>
      </Grid>
      <ErrorDialog />
    </>
  );
}

export default Payment;
