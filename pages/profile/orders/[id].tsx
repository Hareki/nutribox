import { ShoppingBag } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useFormik } from 'formik';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { Fragment, useMemo, useState } from 'react';

import productApiCaller from 'api-callers/product/[slug]';
import orderApiCaller from 'api-callers/profile/orders';
import {
  CustomerCancelOrderDtoSchema,
  type CustomerCancelOrderDto,
} from 'backend/dtos/profile/orders/cancelOrder.dto';
import type { CommonProductModel } from 'backend/services/product/helper';
import { Small } from 'components/abstract/Typography';
import CircularProgressBlock from 'components/common/CircularProgressBlock';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import Navigations from 'components/layouts/customer-dashboard/Navigations';
import OrderDetailsViewer from 'components/orders/OrderDetailViewer';
import { useCustomTranslation } from 'hooks/useCustomTranslation';
import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';
import { toFormikValidationSchema } from 'utils/zodFormikAdapter.helper';

function ProfileOrderDetails() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const id = router.query.id as string;
  const { t } = useCustomTranslation(['customerOrder']);

  const { data: order } = useQuery({
    queryKey: ['order', id],
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
      queryClient.invalidateQueries(['order', order!.id]);
      setOpenDialog(false);
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

  const handleSubmitCancellationForm = (values: CustomerCancelOrderDto) => {
    cancelOrder(values);
  };

  const { values, handleSubmit, handleBlur, handleChange, touched, errors } =
    useFormik<CustomerCancelOrderDto>({
      initialValues: {
        cancellationReason: '',
      },
      validationSchema: toFormikValidationSchema(CustomerCancelOrderDtoSchema),
      onSubmit: handleSubmitCancellationForm,
    });

  const [openDialog, setOpenDialog] = useState(false);

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
        cancelOrderCallback={() => setOpenDialog(true)}
      />

      <Dialog fullWidth open={openDialog}>
        <DialogTitle>Hủy đơn hàng</DialogTitle>
        <DialogContent>
          <div
            style={{
              marginTop: '12px',
            }}
          >
            <form onSubmit={handleSubmit}>
              <Small
                display='block'
                mb={1}
                textAlign='left'
                fontWeight='600'
                color='grey.700'
              >
                Vui lòng nhập lý do hủy đơn:
              </Small>
              <TextField
                fullWidth
                multiline
                rows={3}
                name='cancellationReason'
                size='small'
                type='text'
                variant='outlined'
                onBlur={handleBlur}
                value={values.cancellationReason}
                onChange={handleChange}
                error={
                  !!touched.cancellationReason && !!errors.cancellationReason
                }
                helperText={t(
                  (touched.cancellationReason &&
                    errors.cancellationReason) as string,
                )}
              />
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isCancellingOrder}
            onClick={() => handleSubmit()}
            color='error'
          >
            Xác nhận
          </LoadingButton>
          <Button
            disabled={isCancellingOrder}
            onClick={() => setOpenDialog(false)}
            color='error'
          >
            Huỷ bỏ
          </Button>
        </DialogActions>
      </Dialog>
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
