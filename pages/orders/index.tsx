import { ShoppingBag } from '@mui/icons-material';
import { Pagination } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';

import { H5 } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBox } from 'components/flex-box';
import CustomerDashboardLayout from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import Order from 'models/Order.model';
import OrderRow from 'pages-sections/orders/OrderRow';
import api from 'utils/__api__/orders';

// ====================================================
type OrderProps = { orderList: Order[] };
// ====================================================

const Orders: NextPage<OrderProps> = ({ orderList }) => {
  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        title='My Orders'
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* ORDER LIST AREA */}
      <TableRow
        elevation={0}
        sx={{
          padding: '0px 18px',
          background: 'none',
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Order #
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Status
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Date purchased
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Total
        </H5>

        <H5
          my={0}
          px={2.75}
          color='grey.600'
          flex='0 0 0 !important'
          display={{ xs: 'none', md: 'block' }}
        />
      </TableRow>

      {orderList.map((order) => (
        <OrderRow order={order} key={order.id} />
      ))}

      <FlexBox justifyContent='center' mt={5}>
        <Pagination
          count={5}
          color='primary'
          variant='outlined'
          onChange={(data) => console.log(data)}
        />
      </FlexBox>
    </CustomerDashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const orderList = await api.getOrders();
  return { props: { orderList } };
};

export default Orders;
