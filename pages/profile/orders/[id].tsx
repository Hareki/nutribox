import { ShoppingBag } from '@mui/icons-material';
import { Button } from '@mui/material';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import { Fragment, useReducer } from 'react';

import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import Navigations from 'components/layouts/customer-dashboard/Navigations';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';
import productApiCaller from 'api-callers/product/[slug]';
import orderApiCaller from 'api-callers/profile/orders';

type Props = {
  initialOrder: ICustomerOrder;
};

function ProfileOrderDetails({ initialOrder }: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: order } = useQuery({
    queryKey: ['order', initialOrder.id],
    queryFn: () => orderApiCaller.getOrder(initialOrder.id),
    initialData: initialOrder,
  });

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const { mutate: cancelOrder, isLoading } = useMutation({
    mutationFn: () => orderApiCaller.cancelOrder(order.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', initialOrder.id]);
      enqueueSnackbar('Huỷ đơn hàng thành công', {
        variant: 'success',
      });
    },
  });

  const productsOfOrders = useQueries({
    queries: order.items.map((item) => ({
      queryKey: ['product', item.product.toString()],
      queryFn: () => productApiCaller.getProduct(item.product.toString()),
    })),
  });

  const HEADER_BUTTON = (
    <Button color='primary' sx={{ bgcolor: 'primary.light', px: 3 }}>
      Quay lại
    </Button>
  );

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;
  const order = await CustomerOrderController.getOne({
    id: context.params.id as string,
  });

  return {
    props: { initialOrder: serialize(order) },
  };
};
ProfileOrderDetails.getLayout = getCustomerDashboardLayout;

export default ProfileOrderDetails;
