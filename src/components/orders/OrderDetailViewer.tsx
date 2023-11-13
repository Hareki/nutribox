import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import UpgradeRoundedIcon from '@mui/icons-material/UpgradeRounded';
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
  useTheme,
} from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Fragment, useMemo, useState } from 'react';

import ExportOrderDetailTable from './ExportOrderDetailTable';
import OrderPaymentChip from './OrderPaymentChip';

import { EmployeeRole, OrderStatus } from 'backend/enums/entities.enum';
import { PaymentMethod } from 'backend/enums/entities.enum';
import type { ExportOrderDetails } from 'backend/services/customerOrder/helper';
import { CustomerOrderStatusOrders } from 'backend/services/customerOrder/helper';
import type { CommonProductModel } from 'backend/services/product/helper';
import { H5, H6, Paragraph, Span } from 'components/abstract/Typography';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Delivery from 'components/icons/Delivery';
import PackageBox from 'components/icons/PackageBox';
import TruckFilled from 'components/icons/TruckFilled';
import {
  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,
  PRODUCT_DETAIL_ROUTE,
} from 'constants/routes.ui.constant';
import { getFullAddressFromNames } from 'helpers/address.helper';
import { getOrderStatusName } from 'helpers/order.helper';
import { formatCurrency, formatDateTime } from 'lib';
import type { PopulateCustomerOrderFields } from 'models/customerOrder.model';
import { insertId, matchesPlaceHolderRoute } from 'utils/middleware.helper';

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

const stepIconList = [DescriptionSharpIcon, PackageBox, TruckFilled, Delivery];
const cancelIconList = [DescriptionSharpIcon, CancelIcon];

const getCurrentStatusIndex = (
  order: PopulateCustomerOrderFields<'customerOrderItems'>,
) => {
  return CustomerOrderStatusOrders.indexOf(order.status);
};

interface OrderDetailsViewerProps {
  order: PopulateCustomerOrderFields<'customerOrderItems'>;
  productsOfOrders: UseQueryResult<CommonProductModel, unknown>[];
  isCancelling?: boolean;
  cancelOrderCallback?: () => void;
  isUpdating?: boolean;
  upgradeOrderStatusCallBack?: () => void;
  exportOrderDetails?: ExportOrderDetails[];
  role?: EmployeeRole;
}
const OrderDetailsViewer = ({
  order,
  isUpdating,
  productsOfOrders,
  cancelOrderCallback,
  upgradeOrderStatusCallBack,
  exportOrderDetails,
  role,
}: OrderDetailsViewerProps) => {
  const { transitions } = useTheme();
  const router = useRouter();

  const [isHover, setIsHover] = useState(false);

  const isStaff = matchesPlaceHolderRoute(
    router.pathname,
    CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,
    true,
  );
  const isAuthorizedToUpgrade =
    (isStaff && role === EmployeeRole.CASHIER) || role === EmployeeRole.SHIPPER;

  const cancelIndex = CustomerOrderStatusOrders.length - 1;
  const cancelableIndexThreshHold = isStaff ? 2 : 1;
  const statusIndex = useMemo(() => getCurrentStatusIndex(order), [order]);
  const delivered = statusIndex - Number(isHover) === cancelIndex - 1;
  const isOrderCancelled = statusIndex === cancelIndex;
  const canCancel = statusIndex <= cancelableIndexThreshHold;
  const shouldIncreaseIndex = isHover && !(isOrderCancelled || delivered);

  const finalIndex = shouldIncreaseIndex ? statusIndex + 1 : statusIndex;

  let iconList = stepIconList;
  if (statusIndex === cancelIndex) {
    iconList = cancelIconList;
  }

  const imageUrls = productsOfOrders.map(
    (item) => item.data?.productImages[0].imageUrl,
  );

  return (
    <Fragment>
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
                  !isOrderCancelled
                    ? getOrderStatusName(CustomerOrderStatusOrders[index])
                    : getOrderStatusName(CustomerOrderStatusOrders[cancelIndex])
                }
                placement='top'
              >
                <div
                  style={{
                    position: 'relative',
                  }}
                >
                  <div>
                    <Avatar
                      sx={{
                        transition: `all 0.3s ${transitions.easing.easeInOut}`,
                        width: 64,
                        height: 64,
                        bgcolor:
                          index <= finalIndex ? 'primary.main' : 'grey.300',
                        color:
                          index <= finalIndex ? 'grey.white' : 'primary.main',
                      }}
                    >
                      <Icon color='inherit' sx={{ fontSize: '32px' }} />
                    </Avatar>
                  </div>
                </div>
              </Tooltip>

              {index < iconList.length - 1 && (
                <Box
                  className='line'
                  sx={{
                    transition: `background-color 0.3s ${transitions.easing.easeInOut}`,
                  }}
                  bgcolor={index < finalIndex ? 'primary.main' : 'grey.300'}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

        <Grid container spacing={3} justifyContent='space-around'>
          <Grid item xs='auto'>
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
          </Grid>

          {isAuthorizedToUpgrade && (
            <Grid
              item
              lg='auto'
              xs={12}
              sx={{
                order: {
                  xs: -1,
                  lg: '0',
                },
              }}
            >
              <Tooltip
                title={
                  !(isOrderCancelled || delivered) &&
                  `Thăng cấp lên ${getOrderStatusName(
                    CustomerOrderStatusOrders[getCurrentStatusIndex(order) + 1],
                  )}`
                }
              >
                {/* Use Div instead of Box to avoid errors because of Tooltip component, it still works but throw tons of errors in the console */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <LoadingButton
                    disabled={isOrderCancelled || delivered}
                    loading={isUpdating}
                    variant='contained'
                    color='primary'
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={() => upgradeOrderStatusCallBack?.()}
                  >
                    <UpgradeRoundedIcon sx={{ fontSize: '26px' }} />
                    Thăng cấp
                  </LoadingButton>
                </div>
              </Tooltip>
            </Grid>
          )}

          <Grid item xs='auto'>
            <Typography
              p='0.5rem 1rem'
              textAlign='center'
              borderRadius='300px'
              color='primary.main'
              bgcolor='primary.light'
            >
              Giao hàng dự kiến{' '}
              <Span fontWeight={600}>
                {formatDateTime(order.estimatedDeliveryTime)}
              </Span>
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 0, mb: '30px' }}>
        <TableRow
          sx={{
            p: '12px',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: 'grey.300',
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
                {formatDateTime(new Date(order.deliveredOn))}
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
                height={70}
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
                    src={imageUrls[index]}
                    sx={{
                      height: 64,
                      width: 64,
                      '& .MuiAvatar-img': {
                        objectFit: 'contain',
                      },
                    }}
                  />
                  <Box ml={2.5}>
                    <H6 my='0px'>{product!.name}</H6>

                    <Typography fontSize='14px' color='grey.600'>
                      {formatCurrency(product!.retailPrice)} x{' '}
                      {order.customerOrderItems[index].quantity}
                    </Typography>
                  </Box>
                </FlexBox>

                <Button
                  variant='text'
                  color='primary'
                  onClick={() =>
                    router.push(
                      insertId(
                        PRODUCT_DETAIL_ROUTE,
                        order.customerOrderItems[index].product,
                      ),
                    )
                  }
                >
                  <Typography fontSize='14px'>Thông tin sản phẩm</Typography>
                </Button>
              </FlexBox>
            );
          })}
        </Box>
      </Card>

      {/* SHIPPING AND ORDER SUMMERY */}
      <Grid container spacing={3}>
        {exportOrderDetails && order.status !== OrderStatus.CANCELLED && (
          <Grid item xs={12}>
            <ExportOrderDetailTable exportOrderDetails={exportOrderDetails} />
          </Grid>
        )}

        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px', height: '100%' }}>
            <H5 mt={0} mb={2}>
              Địa chỉ giao hàng
            </H5>

            <Paragraph fontSize={14} my={0}>
              {getFullAddressFromNames(order)}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px', height: '100%' }}>
            <Grid container gap={6}>
              <Grid item xs={4}>
                <H5 mt={0} mb={2}>
                  Số điện thoại
                </H5>

                <Paragraph fontSize={14} my={0}>
                  {order.phone}
                </Paragraph>
              </Grid>

              <Grid item xs={4}>
                <H5 mt={0} mb={2}>
                  Thanh toán
                </H5>

                <OrderPaymentChip
                  paymentMethod={order.paidOnlineVia || PaymentMethod.COD}
                />
              </Grid>
            </Grid>
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

        {!isOrderCancelled &&
          canCancel &&
          (isAuthorizedToUpgrade || !isStaff) && (
            <LoadingButton
              onClick={() => cancelOrderCallback?.()}
              loadingPosition='center'
              color='error'
              variant='contained'
              sx={{ height: 44, ml: 'auto', mt: 3 }}
            >
              Hủy đơn hàng
            </LoadingButton>
          )}
      </Grid>
    </Fragment>
  );
};

export default OrderDetailsViewer;
