import { Grid } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { CheckoutRequestBody } from '../../../../pages/api/checkout';
import type { Step1Data, Step2Data } from '../../../../pages/checkout';

import PaymentForm from './PaymentForm';
import PaymentSummary from './PaymentSummary';

import type { IAccount } from 'api/models/Account.model/types';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import PageLayout from 'components/layouts/PageLayout';
import { convertCartToOrderRb } from 'helpers/product.helper';
import apiCaller from 'utils/apiCallers/checkout';

Payment.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

interface PaymentProps {
  step1Data: Step1Data;
  prevStep: (currentStep: number) => void;
  account: IAccount;
}

type ConvertInput = {
  data1: Step1Data;
  data2: Step2Data;
};

const convertDataToRequestBody = (input: ConvertInput): CheckoutRequestBody => {
  const requestBody: CheckoutRequestBody = {
    ...input.data1,
    ...input.data1.address,
    items: input.data1.cartItems.map(convertCartToOrderRb),
    accountId: input.data2.accountId,
    paid: input.data2.paid,
  };

  return requestBody;
};

function Payment({ account, prevStep, step1Data }: PaymentProps): ReactElement {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: completeOrder, isLoading } = useMutation<
    ICustomerOrder,
    unknown,
    Step2Data
  >({
    mutationFn: (step2Data) => {
      const requestBody = convertDataToRequestBody({
        data1: step1Data,
        data2: step2Data,
      });
      console.log('file: index.tsx:62 - Payment - requestBody:', requestBody);
      return apiCaller.completeOrder(requestBody);
    },
    onSuccess: () => {
      queryClient.refetchQueries(['cart', account.id]);
      enqueueSnackbar('Đặt hàng thành công', { variant: 'success' });
      setRedirecting(true);
      router.push('/profile/order');
    },
  });
  return (
    <Grid container flexWrap='wrap-reverse' spacing={4}>
      <Grid item lg={7.5} md={7.5} xs={12}>
        <PaymentForm
          prevStep={prevStep}
          completeOrder={completeOrder}
          account={account}
          isLoading={isLoading}
          redirecting={redirecting}
        />
      </Grid>

      <Grid item lg={4.5} md={4.5} xs={12}>
        <PaymentSummary step1Data={step1Data} />
      </Grid>
    </Grid>
  );
}

export default Payment;
