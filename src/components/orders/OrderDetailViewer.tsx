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
import { Fragment, useEffect, useState } from 'react';

import OrderPaymentChip from './OrderPaymentChip';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { IProduct } from 'api/models/Product.model/types';
import { H5, H6, Paragraph, Span } from 'components/abstract/Typography';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Delivery from 'components/icons/Delivery';
import PackageBox from 'components/icons/PackageBox';
import TruckFilled from 'components/icons/TruckFilled';
import { getFullAddress } from 'helpers/address.helper';
import { getOrderStatusName } from 'helpers/order.helper';
import { formatCurrency, formatDateTime } from 'lib';
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

const stepIconList = [DescriptionSharpIcon, PackageBox, TruckFilled, Delivery];
const cancelIconList = [DescriptionSharpIcon, CancelIcon];
const cancelIndex = 4;
const getCurrentStatusIndex = (order: ICustomerOrder) =>
  AllStatusIdArray.indexOf(order.status.toString());

interface OrderDetailsViewerProps {
  order: ICustomerOrder;
  productsOfOrders: UseQueryResult<IProduct, unknown>[];
  isCancelling?: boolean;
  cancelOrderCallback?: () => void;
  isUpdating?: boolean;
  updateOrderCallback?: () => void;
}
const OrderDetailsViewer = ({
  order,
  isCancelling,
  isUpdating,
  productsOfOrders,
  cancelOrderCallback,
  updateOrderCallback,
}: OrderDetailsViewerProps) => {
  const { transitions } = useTheme();
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  const [isHover, setIsHover] = useState(false);

  const [statusIndex, setStatusIndex] = useState(getCurrentStatusIndex(order));
  useEffect(() => {
    const newIndex = getCurrentStatusIndex(order);
    setStatusIndex(newIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.status]);

  useEffect(() => {
    if (isHover && !(isCancel || delivered)) {
      setStatusIndex((prev) => prev + 1);
      return;
    }
    setStatusIndex(getCurrentStatusIndex(order));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHover]);

  const delivered = statusIndex - Number(isHover) === cancelIndex - 1;
  const isCancel = statusIndex === cancelIndex;
  const canCancel = statusIndex <= CancelIndexThreshHold;

  let iconList = stepIconList;
  if (statusIndex === cancelIndex) {
    iconList = cancelIconList;
  }

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
                  !isCancel
                    ? getOrderStatusName(AllStatusIdArray[index])
                    : getOrderStatusName(AllStatusIdArray[cancelIndex])
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
                          index <= statusIndex ? 'primary.main' : 'grey.300',
                        color:
                          index <= statusIndex ? 'grey.white' : 'primary.main',
                      }}
                    >
                      <Icon color='inherit' sx={{ fontSize: '32px' }} />
                    </Avatar>
                  </div>

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
                </div>
              </Tooltip>

              {index < iconList.length - 1 && (
                <Box
                  className='line'
                  sx={{
                    transition: `background-color 0.3s ${transitions.easing.easeInOut}`,
                  }}
                  bgcolor={index < statusIndex ? 'primary.main' : 'grey.300'}
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

          {isAdmin && (
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
                  !(isCancel || delivered) &&
                  `Thăng cấp lên ${getOrderStatusName(
                    AllStatusIdArray[getCurrentStatusIndex(order) + 1],
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
                    disabled={isCancel || delivered}
                    loading={isUpdating}
                    variant='contained'
                    color='primary'
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={() => updateOrderCallback?.()}
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
                {formatDateTime(
                  new Date(order.estimatedDeliveryTime as string),
                )}
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

                <OrderPaymentChip paid={order.paid} />
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
        {!isAdmin && !isCancel && canCancel && (
          <LoadingButton
            onClick={() => cancelOrderCallback?.()}
            loading={isCancelling}
            loadingPosition='center'
            color='error'
            variant='contained'
            sx={{ height: 44, ml: 'auto', mt: 3 }}
          >
            Huỷ đơn hàng
          </LoadingButton>
        )}
      </Grid>
    </Fragment>
  );
};

export default OrderDetailsViewer;
