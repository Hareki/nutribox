import { ShoppingBag } from '@mui/icons-material';
import { Button } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Fragment, useMemo, useReducer } from 'react';

import productApiCaller from 'api-callers/product/[slug]';
import orderApiCaller from 'api-callers/profile/orders';
import type { CommonProductModel } from 'backend/services/product/helper';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import Navigations from 'components/layouts/customer-dashboard/Navigations';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';

function ProfileOrderDetails() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const id = router.query.id as string;

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApiCaller.getOrder(id),
  });

  const [confirmState, dispatchConfirm] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );

  const { mutate: cancelOrder, isLoading } = useMutation({
    mutationFn: () =>
      orderApiCaller.cancelOrder(order!.id, {
        // TODO
        cancellationReason: 'Lý do hủy của khách hàng',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', order!.id]);
      enqueueSnackbar('Huỷ đơn hàng thành công', {
        variant: 'success',
      });
    },
  });

  const productsOfOrders = useQueries({
    queries:
      order?.customerOrderItems.map((item) => ({
        queryKey: ['product', item.product],
        queryFn: () => productApiCaller.getProduct(item.product, false),
      })) || [],
  }) as UseQueryResult<CommonProductModel, unknown>[];

  const HEADER_BUTTON = (
    <Button color='primary' sx={{ bgcolor: 'primary.light', px: 3 }}>
      Quay lại
    </Button>
  );

  const isLoadingProductsOfOrders = useMemo(
    () => productsOfOrders.some((query) => query.data === undefined),
    [productsOfOrders],
  );

  // console.log(
  //   'file: [id].tsx:79 - ProfileOrderDetails - isLoadingProductsOfOrders:',
  //   isLoadingProductsOfOrders,
  // );
  console.log('file: [id].tsx:79 - ProfileOrderDetails - order:', order);

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
        isCancelling={isLoading}
        cancelOrderCallback={() =>
          dispatchConfirm({
            type: 'open_dialog',
            payload: {
              content: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
              title: 'Huỷ đơn hàng',
            },
          })
        }
      />
      <ConfirmDialog
        open={confirmState.open}
        content={confirmState.content}
        title={confirmState.title}
        handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
        handleConfirm={() => {
          cancelOrder();
          dispatchConfirm({ type: 'confirm_dialog' });
        }}
      />
    </Fragment>
  );
}

ProfileOrderDetails.getLayout = getCustomerDashboardLayout;

export default ProfileOrderDetails;
