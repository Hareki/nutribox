import { Done, ShoppingBag } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  styled,
} from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import type { FC } from 'react';
import { Fragment } from 'react';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H5, H6, Paragraph } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBetween, FlexBox } from 'components/flex-box';
import Delivery from 'components/icons/Delivery';
import PackageBox from 'components/icons/PackageBox';
import TruckFilled from 'components/icons/TruckFilled';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { getFullAddress } from 'helpers/address.helper';
import useWindowSize from 'hooks/useWindowSize';
import { formatCurrency } from 'lib';
import apiCaller from 'utils/apiCallers/product/[slug]';

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

type OrderStatus = 'Packaging' | 'Shipping' | 'Delivering' | 'Complete';

type Props = {
  accountId: string;
  setOrderDetails: (order: ICustomerOrder) => void;
  order: ICustomerOrder;
};

const OrderDetails: FC<Props> = ({ order, setOrderDetails }) => {
  const width = useWindowSize();
  const orderStatus: OrderStatus = 'Shipping';
  const orderStatusList = ['Packaging', 'Shipping', 'Delivering', 'Complete'];
  const stepIconList = [PackageBox, TruckFilled, Delivery];

  const breakpoint = 350;
  const statusIndex = orderStatusList.indexOf(orderStatus);

  const result = useQueries({
    queries: order.items.map((item) => ({
      queryKey: ['product', item.product.toString()],
      queryFn: () => apiCaller.getProduct(item.product.toString()),
    })),
  });

  const HEADER_BUTTON = (
    <Button
      color='primary'
      sx={{ bgcolor: 'primary.light', px: 3 }}
      onClick={() => setOrderDetails(null)}
    >
      Quay lại
    </Button>
  );

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={ShoppingBag}
        title='Order Details'
        navigation={<CustomerDashboardNavigation />}
        button={HEADER_BUTTON}
      />

      <Card sx={{ p: '2rem 1.5rem', mb: '30px' }}>
        <StyledFlexbox>
          {stepIconList.map((Icon, index) => (
            <Fragment key={index}>
              <Box position='relative'>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: index <= statusIndex ? 'primary.main' : 'grey.300',
                    color: index <= statusIndex ? 'grey.white' : 'primary.main',
                  }}
                >
                  <Icon color='inherit' sx={{ fontSize: '32px' }} />
                </Avatar>

                {index < statusIndex && (
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
                )}
              </Box>

              {index < stepIconList.length - 1 && (
                <Box
                  className='line'
                  bgcolor={index < statusIndex ? 'primary.main' : 'grey.300'}
                />
              )}
            </Fragment>
          ))}
        </StyledFlexbox>

        <FlexBox justifyContent={width < breakpoint ? 'center' : 'flex-end'}>
          <Typography
            p='0.5rem 1rem'
            textAlign='center'
            borderRadius='300px'
            color='primary.main'
            bgcolor='primary.light'
          >
            Estimated Delivery Date <b>4th October</b>
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
          }}
        >
          <FlexBox className='pre' m={0.75} alignItems='center'>
            <Typography fontSize={14} color='grey.600' mr={0.5}>
              Order ID:
            </Typography>

            <Typography fontSize={14}>{order.id}</Typography>
          </FlexBox>

          <FlexBox className='pre' m={0.75} alignItems='center'>
            <Typography fontSize={14} color='grey.600' mr={0.5}>
              Placed on:
            </Typography>

            <Typography fontSize={14}>
              {format(new Date(order.createdAt), 'dd MMM, yyyy')}
            </Typography>
          </FlexBox>

          <FlexBox className='pre' m={0.75} alignItems='center'>
            <Typography fontSize={14} color='grey.600' mr={0.5}>
              Delivered on:
            </Typography>

            <Typography fontSize={14}>
              {format(new Date(), 'dd MMM, yyyy')}
            </Typography>
          </FlexBox>
        </TableRow>

        <Box py={1}>
          {result.map((item, index) => {
            const product = item.data;
            return (
              <FlexBox
                px={2}
                py={1}
                flexWrap='wrap'
                alignItems='center'
                key={index}
              >
                <FlexBox flex='2 2 260px' m={0.75} alignItems='center'>
                  <Avatar
                    src={product.imageUrls[0]}
                    sx={{ height: 64, width: 64 }}
                  />
                  <Box ml={2.5}>
                    <H6 my='0px'>{product.name}</H6>

                    <Typography fontSize='14px' color='grey.600'>
                      {formatCurrency(product.retailPrice)} x{' '}
                      {order.items[index].quantity}
                    </Typography>
                  </Box>
                </FlexBox>

                <FlexBox flex='1 1 260px' m={0.75} alignItems='center'>
                  <Typography fontSize='14px' color='grey.600'>
                    Product properties: Black, L
                  </Typography>
                </FlexBox>

                <FlexBox flex='160px' m={0.75} alignItems='center'>
                  <Button variant='text' color='primary'>
                    <Typography fontSize='14px'>Write a Review</Typography>
                  </Button>
                </FlexBox>
              </FlexBox>
            );
          })}
        </Box>
      </Card>

      {/* SHIPPING AND ORDER SUMMERY */}
      <Grid container spacing={3}>
        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px' }}>
            <H5 mt={0} mb={2}>
              Shipping Address
            </H5>

            <Paragraph fontSize={14} my={0}>
              {getFullAddress(order)}
            </Paragraph>
          </Card>
        </Grid>

        <Grid item lg={6} md={6} xs={12}>
          <Card sx={{ p: '20px 30px' }}>
            <H5 mt={0} mb={2}>
              Total Summary
            </H5>

            <Typography fontSize={14}>Paid by Credit/Debit Card</Typography>
          </Card>
        </Grid>
      </Grid>
    </CustomerDashboardLayout>
  );
};

export default OrderDetails;
