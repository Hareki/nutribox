import { ShoppingBag } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  styled,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Fragment, useReducer } from 'react';

import { authOptions } from '../../api/auth/[...nextauth]';

import CustomerOrderController from 'api/controllers/CustomerOrder.controller';
import { serialize } from 'api/helpers/object.helper';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H5, H6, Paragraph, Span } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import ConfirmDialog from 'components/dialog/confirm-dialog';
import { confirmDialogReducer } from 'components/dialog/confirm-dialog/reducer';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Delivery from 'components/icons/Delivery';
import PackageBox from 'components/icons/PackageBox';
import TruckFilled from 'components/icons/TruckFilled';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getFullAddress } from 'helpers/address.helper';
import { getOrderStatusName } from 'helpers/order.helper';
import { formatCurrency, formatDateTime } from 'lib';
import productApiCaller from 'utils/apiCallers/product/[slug]';
import orderApiCaller from 'utils/apiCallers/profile/order';
import { AllStatusIdArray, CancelIndexThreshHold } from 'utils/constants';
const StyledFlexbox = styled(FlexBetween)(({ theme }) => ({
  flexWrap: 'wrap',
  marginTop: '2rem',
  marginBottom: '2rem',
  [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
  '& .line': {
    height: 4,
    minWidth: 50,
    flex: '1 1 0',
    [theme.breakpoints.down('sm')]: { flex: 'unset', height: 50, minWidth: 4 },
  },
}));

type Props = {
  sessionUserId: string;
  initialOrder: ICustomerOrder;
};
const stepIconList = [DescriptionSharpIcon, PackageBox, TruckFilled, Delivery];
const cancelIconList = [DescriptionSharpIcon, CancelIcon];
const cancelIndex = 4;

function OrderDetails({ initialOrder, sessionUserId }: Props) {
  const queryClient = useQueryClient();

  const { data: order } = useQuery({
    queryKey: ['order', sessionUserId],
    queryFn: () => orderApiCaller.getOrder(initialOrder.id),
    initialData: initialOrder,
  });

  const [confirmState, dispatchConfirm] = useReducer(confirmDialogReducer, {
    open: false,
  });

  const { mutate: cancelOrder, isLoading } = useMutation({
    mutationFn: () => orderApiCaller.cancelOrder(order.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', sessionUserId]);
    },
  });

  const statusIndex = AllStatusIdArray.indexOf(order.status.toString());
  const isCancel = statusIndex === cancelIndex;
  const canCancel = statusIndex <= CancelIndexThreshHold;

  let iconList = stepIconList;
  if (statusIndex === cancelIndex) {
    iconList = cancelIconList;
  }

  const productsOfOrders = useQueries({
    queries: order.items.map((item) => ({
      queryKey: ['product', item.product.toString()],
      queryFn: () => productApiCaller.getProduct(item.product.toString()),
    })),
  });

  const HEADER_BUTTON = (
    <Button color='primary' sx={{ bgcolor: 'primary.light', px: 4 }}>
      Quay lại
    </Button>
  );

  return (
    <Fragment>
      <UserDashboardHeader
        icon={ShoppingBag}
        title='Chi tiết đơn hàng'
        navigation={<CustomerDashboardNavigation />}
        button={HEADER_BUTTON}
      />

      <Card sx={{ p: '2rem 1.5rem', mb: '30px' }}>
        <StyledFlexbox>
          {iconList.map((Icon, index) => (
            <Fragment key={index}>
              <Tooltip
                // open={
                //   (!isCancel && statusIndex === index) ||
                //   (isCancel && index === 1)
                // }
                // open
                title={
                  !isCancel
                    ? getOrderStatusName(AllStatusIdArray[index])
                    : getOrderStatusName(AllStatusIdArray[cancelIndex])
                }
                placement='top'
              >
                <Box position='relative'>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor:
                        index <= statusIndex ? 'primary.main' : 'grey.300',
                      color:
                        index <= statusIndex ? 'grey.white' : 'primary.main',
                    }}
                  >
                    <Icon color='inherit' sx={{ fontSize: '32px' }} />
                  </Avatar>

                  {/* {index < statusIndex && (
                    <Box position='absolute' right='0' top='0'>
                      <Avatar
                        sx={{
                          width: 22,
                          height: 22,
                          bgcolor: 'grey.200',
                          color: 'success.main',
                        }}
                      >
                        <Done color='inherit' sx={{ fontSize: '1rem' }} />
                      </Avatar>
                    </Box>
                  )} */}
                </Box>
              </Tooltip>

              {index < iconList.length - 1 && (
                <Box
                  className='line'
                  bgcolor={index < statusIndex ? 'primary.main' : 'grey.300'}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

        <FlexBox justifyContent='space-around'>
          <Typography
            p='0.5rem 1rem'
            textAlign='center'
            borderRadius='300px'
            color='primary.main'
            bgcolor='primary.light'
          >
            Quãng đường ước tính{' '}
            <Span fontWeight={600}>{order.estimatedDistance} km</Span>
          </Typography>

          <Typography
            p='0.5rem 1rem'
            textAlign='center'
            borderRadius='300px'
            color='primary.main'
            bgcolor='primary.light'
          >
            Giao hàng dự kiến{' '}
            <Span fontWeight={600}>
              {formatDateTime(new Date(order.estimatedDeliveryTime as string))}
            </Span>
          </Typography>
        </FlexBox>
      </Card>

      <Card sx={{ p: 0, mb: '30px' }}>
        <TableRow
          sx={{
            p: '12px',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: 'grey.200',
            justifyContent: 'space-around',
            '& .pre': {
              flexGrow: 0,
            },
          }}
        >
          <FlexBox className='pre' m={0.75} alignItems='center'>
            <Typography fontSize={14} color='grey.600' mr={0.5}>
              Mã vận đơn:
            </Typography>

            <Typography fontSize={14}>{order.id}</Typography>
          </FlexBox>

          <FlexBox className='pre' m={0.75} alignItems='center'>
            <Typography fontSize={14} color='grey.600' mr={0.5}>
              Đặt vào lúc:
            </Typography>

            <Typography fontSize={14}>
              {formatDateTime(new Date(order.createdAt))}
            </Typography>
          </FlexBox>

          {order.deliveredOn && (
            <FlexBox className='pre' m={0.75} alignItems='center'>
              <Typography fontSize={14} color='grey.600' mr={0.5}>
                Giao vào lúc:
              </Typography>

              <Typography fontSize={14}>
                {formatDateTime(order.deliveredOn as Date)}
              </Typography>
            </FlexBox>
          )}
        </TableRow>

        <Box py={1}>
          {productsOfOrders.map((item, index) => {
            const isLoading = item.isLoading;
            const product = item.data;
            return isLoading ? (
              <Skeleton
                key={index}
                variant='rectangular'
                animation='wave'
                width='95%'
                height={50}
                sx={{
                  mx: 'auto',
                  borderRadius: '8px',
                  my: '1rem',
                }}
              />
            ) : (
              <FlexBox
                px={2}
                py={1}
                flexWrap='wrap'
                alignItems='center'
                key={index}
              >
                <FlexBox flex='2 2 260px' m={0.75} alignItems='center'>
                  <Avatar
                    variant='square'
                    src={product.imageUrls[0]}
                    sx={{
                      height: 64,
                      width: 64,
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                      },
                    }}
                  />
                  <Box ml={2.5}>
                    <H6 my='0px'>{product.name}</H6>

                    <Typography fontSize='14px' color='grey.600'>
                      {formatCurrency(product.retailPrice)} x{' '}
                      {order.items[index].quantity}
                    </Typography>
                  </Box>
                </FlexBox>

                <Button variant='text' color='primary'>
                  <Typography fontSize='14px'>Thông tin sản phẩm</Typography>
                </Button>
              </FlexBox>
            );
          })}
        </Box>
      </Card>

      {/* SHIPPING AND ORDER SUMMERY */}
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px', height: '100%' }}>
            <H5 mt={0} mb={2}>
              Địa chỉ giao hàng
            </H5>

            <Paragraph fontSize={14} my={0}>
              {getFullAddress(order)}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px', height: '100%' }}>
            <H5 mt={0} mb={2}>
              Số điện thoại
            </H5>

            <Paragraph fontSize={14} my={0}>
              {order.phone}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: '20px 30px' }}>
            <H5 mt={0} mb={2}>
              Ghi chú
            </H5>

            <Paragraph fontSize={14} my={0}>
              {order.note ? order.note : '_'}
            </Paragraph>
          </Card>
        </Grid>
        {!isCancel && canCancel && (
          <LoadingButton
            onClick={() =>
              dispatchConfirm({
                type: 'open_dialog',
                payload: {
                  content: 'Bạn có chắc chắn muốn huỷ đơn hàng này không?',
                  title: 'Huỷ đơn hàng',
                },
              })
            }
            loading={isLoading}
            loadingPosition='center'
            color='error'
            variant='contained'
            sx={{ height: 44, ml: 'auto', mt: 3 }}
          >
            Huỷ đơn hàng
          </LoadingButton>
        )}
      </Grid>
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
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const order = await CustomerOrderController.getOne({
    id: context.params.id as string,
  });

  return {
    props: { sessionUserId: session.user.id, initialOrder: serialize(order) },
  };
};
OrderDetails.getLayout = getCustomerDashboardLayout;

export default OrderDetails;
