import { Box } from '@mui/material';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import type { ReactElement } from 'react';
import { useReducer, useState } from 'react';

import productApiCaller from 'api-callers/product/[slug]';
import staffCustomerOrderCaller from 'api-callers/staff/customer-orders';
import type { CustomerCancelOrderDto } from 'backend/dtos/profile/orders/cancelOrder.dto';
import { Paragraph, Span } from 'components/abstract/Typography';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import AdminDetailsViewHeader from 'components/common/layout/header/AdminDetailsViewHeader';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import {
  confirmDialogReducer,
  initConfirmDialogState,
} from 'components/dialog/confirm-dialog/reducer';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import CancelOrderDialog from 'components/orders/CancelOrderDialog';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';
import { CUSTOMER_ORDERS_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { getNextOrderStatusName } from 'helpers/order.helper';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';

AdminOrderDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

function AdminOrderDetails() {
  const { data: session } = useSession();
  const role = session?.employeeAccount.employee.role;

  const queryClient = useQueryClient();
  const id = useRouter().query.id as string;
  const { enqueueSnackbar } = useSnackbar();

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ['staff', 'customer-orders', id],
    queryFn: () => staffCustomerOrderCaller.getOrder(id),
  });

  const { data: exportOrderDetails, isLoading: isLoadingExportOrderDetails } =
    useQuery({
      queryKey: ['staff', 'customer-orders', 'export-order-details', id],
      queryFn: () => staffCustomerOrderCaller.getExportOrderDetails(id),
    });

  const [confirmState, dispatchConfirm] = useReducer(
    confirmDialogReducer,
    initConfirmDialogState,
  );

  const { t } = useCustomTranslation(['customerOrder']);

  const handleSubmitForm = (values: CustomerCancelOrderDto) => {
    cancelOrder(values);
  };

  const [cancelOrderDialogVisible, setCancelOrderDialogVisible] =
    useState(false);

  const { mutate: upgradeOrderStatus, isLoading: isUpgradingOrder } =
    useMutation({
      mutationFn: () => staffCustomerOrderCaller.upgradeOrderStatus(id),
      onSuccess: () => {
        queryClient.refetchQueries(['customer-orders', id]);
        enqueueSnackbar(t('CustomerOrder.UpgradeStatus.Success'), {
          variant: 'success',
        });
      },
      onError: (err) => {
        enqueueSnackbar(t('Internet.Error'), {
          variant: 'error',
        });
        console.log(err);
      },
    });

  const { mutate: cancelOrder, isLoading: isCancellingOrder } = useMutation<
    PopulateCustomerOrderFields<'customerOrderItems'>,
    unknown,
    CustomerCancelOrderDto
  >({
    mutationFn: ({ cancellationReason }) =>
      staffCustomerOrderCaller.cancelOrder(order!.id, {
        cancellationReason,
      }),
    onSuccess: () => {
      queryClient.refetchQueries(['customer-orders', order!.id]);
      setCancelOrderDialogVisible(false);
      enqueueSnackbar(t('CustomerOrder.Cancellation.Success'), {
        variant: 'success',
      });
    },
  });

  const productsOfOrders = useQueries({
    queries:
      order?.customerOrderItems.map((item) => ({
        queryKey: ['products', item.product.toString()],
        queryFn: () => productApiCaller.getProduct(item.product.toString()),
      })) || [],
  });

  if (isLoadingOrder || isLoadingExportOrderDetails) {
    return <CircularProgressBlock />;
  }

  const status = order!.status;

  return (
    <Box py={4} maxWidth={1200} margin='auto'>
      <AdminDetailsViewHeader
        label='Chi tiết đơn hàng'
        hrefBack={CUSTOMER_ORDERS_STAFF_ROUTE}
      />

      <OrderDetailsViewer
        role={role}
        exportOrderDetails={exportOrderDetails!}
        order={order!}
        productsOfOrders={productsOfOrders}
        isUpdating={isUpgradingOrder}
        cancelOrderCallback={() => setCancelOrderDialogVisible(true)}
        upgradeOrderStatusCallBack={() =>
          dispatchConfirm({
            type: 'open_dialog',
            payload: {
              content: (
                <Paragraph>
                  Thăng cấp trạng thái đơn hàng lên{' '}
                  <Span fontWeight={600}>
                    {getNextOrderStatusName(status)}?
                  </Span>
                </Paragraph>
              ),
              title: 'Xác nhận',
            },
          })
        }
      />
      <ConfirmDialog
        color='primary'
        open={confirmState.open}
        content={confirmState.content}
        title={confirmState.title}
        handleCancel={() => dispatchConfirm({ type: 'cancel_dialog' })}
        handleConfirm={() => {
          upgradeOrderStatus();
          dispatchConfirm({ type: 'confirm_dialog' });
        }}
      />
      {/* <ReactQueryDevtools /> */}
      <CancelOrderDialog
        open={cancelOrderDialogVisible}
        handleSubmitForm={handleSubmitForm}
        isCancellingOrder={isCancellingOrder}
        onCancel={() => setCancelOrderDialogVisible(false)}
        t={t}
      />
    </Box>
  );
}

// export default memo(AdminOrderDetails);
export default AdminOrderDetails;
