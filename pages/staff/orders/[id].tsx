import { Box } from '@mui/material';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import { checkContextCredentials } from 'api/helpers/auth.helper';
import { serialize } from 'api/helpers/object.helper';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { Types } from 'mongoose';
import type { GetServerSideProps } from 'next';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer } from 'react';

import { Paragraph, Span } from 'components/abstract/Typography';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';
import { getNextOrderStatusName } from 'helpers/order.helper';
import productApiCaller from 'api-callers/product/[slug]';
import orderApiCaller from 'api-callers/profile/orders';

AdminOrderDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

type Props = {
  initialOrder: ICustomerOrder;
};

function AdminOrderDetails({ initialOrder }: Props) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: order } = useQuery({
    queryKey: ['order', initialOrder.id],
    queryFn: () => orderApiCaller.getOrder(initialOrder.id),
    initialData: initialOrder,
  });

  const statusId = order.status.toString();

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const { mutate: updateOrder, isLoading } = useMutation({
    mutationFn: () => orderApiCaller.updateOrderStatus(order.id),
    onSuccess: () => {
      queryClient.refetchQueries(['order', initialOrder.id]);
      enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công', {
        variant: 'success',
      });
    },
    onError: (err) => {
      enqueueSnackbar('Đã có lỗi xảy ra, vui lòng thử lại sau', {
        variant: 'error',
      });
      console.log(err);
    },
  });

  const productsOfOrders = useQueries({
    queries: order.items.map((item) => ({
      queryKey: ['product', item.product.toString()],
      queryFn: () => productApiCaller.getProduct(item.product.toString()),
    })),
  });

  return (
    <Box py={4} maxWidth={1200} margin='auto'>
      <AdminDetailsViewHeader
        label='Chi tiết đơn hàng'
        hrefBack='/admin/order'
      />

      <OrderDetailsViewer
        order={order}
        productsOfOrders={productsOfOrders}
        isUpdating={isLoading}
        updateOrderCallback={() =>
          dispatchConfirm({
            type: 'open_dialog',
            payload: {
              content: (
                <Paragraph>
                  Thăng cấp trạng thái đơn hàng lên{' '}
                  <Span fontWeight={600}>
                    {getNextOrderStatusName(statusId)}?
                  </Span>
                </Paragraph>
              ),
              title: 'Xác nhận',
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
          updateOrder();
          dispatchConfirm({ type: 'confirm_dialog' });
        }}
      />
      <ReactQueryDevtools />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  const isValidId = Types.ObjectId.isValid(context.params.id as string);
  if (!isValidId) {
    return {
      notFound: true,
    };
  }

  const order = await CustomerOrderController.getOne({
    id: context.params.id as string,
  });

  if (!order) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialOrder: serialize(order) },
  };
};

export default AdminOrderDetails;
