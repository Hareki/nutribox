import { ShoppingBag } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { Fragment, useMemo, useState } from 'react';

import productApiCaller from 'api-callers/product/[slug]';
import orderApiCaller from 'api-callers/profile/orders';
import { type CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import type { CommonProductModel } from 'backend/services/product/helper';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import Navigations from 'components/layouts/customer-dashboard/Navigations';
import CancelOrderDialog from 'components/orders/CancelOrderDialog';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';
import { ORDERS_ROUTE } from 'constants/routes.ui.constant';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';

function ProfileOrderDetails() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useCustomTranslation(['customerOrder']);

  const { data: order } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderApiCaller.getOrder(id),
  });

  const { mutate: cancelOrder, isLoading: isCancellingOrder } = useMutation<
    PopulateCustomerOrderFields<'customerOrderItems'>,
    unknown,
    CustomerCancelOrderDto
  >({
    mutationFn: ({ cancellationReason }) =>
      orderApiCaller.cancelOrder(order!.id, {
        cancellationReason,
      }),
    onSuccess: () => {
      queryClient.refetchQueries(['orders', order!.id]);
      setCancelOrderDialogVisible(false);
      enqueueSnackbar('Huỷ đơn hàng thành công', {
        variant: 'success',
      });
    },
  });

  const [cancelOrderDialogVisible, setCancelOrderDialogVisible] =
    useState(false);

  const handleSubmitCancellationForm = (values: CustomerCancelOrderDto) => {
    cancelOrder(values);
  };

  // const { CancelOrderDialog, setCancelOrderDialogVisible } =
  //   useCancelOrderDialog(handleSubmitCancellationForm, t, isCancellingOrder);

  const productsOfOrders = useQueries({
    queries:
      order?.customerOrderItems.map((item) => ({
        queryKey: ['product', item.product],
        queryFn: () => productApiCaller.getProduct(item.product, false),
      })) || [],
  }) as UseQueryResult<CommonProductModel, unknown>[];

  const HEADER_BUTTON = (
    <Button
      color='primary'
      sx={{ bgcolor: 'primary.light', px: 3 }}
      onClick={() => router.push(ORDERS_ROUTE)}
    >
      Quay lại
    </Button>
  );

  const isLoadingProductsOfOrders = useMemo(
    () => productsOfOrders.some((query) => query.data === undefined),
    [productsOfOrders],
  );

  if (!order || isLoadingProductsOfOrders) return <CircularProgressBlock />;
  return (
    <Fragment>
      <UserDashboardHeader
        icon={ShoppingBag}
        title='Chi tiết đơn hàng'
        navigation={<Navigations />}
        button={HEADER_BUTTON}
      />
      <OrderDetailsViewer
        order={order}
        productsOfOrders={productsOfOrders}
        isCancelling={isCancellingOrder}
        cancelOrderCallback={() => setCancelOrderDialogVisible(true)}
      />

      <CancelOrderDialog
        open={cancelOrderDialogVisible}
        handleSubmitForm={handleSubmitCancellationForm}
        isCancellingOrder={false}
        onCancel={() => setCancelOrderDialogVisible(false)}
        t={t}
      />
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'customerOrder',
  ]);

  return { props: { ...locales } };
};

ProfileOrderDetails.getLayout = getCustomerDashboardLayout;

export default ProfileOrderDetails;
