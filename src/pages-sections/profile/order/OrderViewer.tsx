import { ShoppingBag } from '@mui/icons-material';
import { Pagination, Skeleton } from '@mui/material';
import type { FC } from 'react';
import { Fragment } from 'react';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H5 } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBox } from 'components/flex-box';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import OrderRow from 'pages-sections/profile/order/OrderRow';

type OrderProps = {
  isLoading: boolean;
  accountId: string;
  setOrderDetails: (order: ICustomerOrder) => void;
  orderList: ICustomerOrder[];
};

const OrderViewer: FC<OrderProps> = ({
  isLoading,
  accountId,
  setOrderDetails,
  orderList,
}) => {
  return (
    <Fragment>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        title='Đơn hàng của tôi'
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
          Đơn hàng #
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Trạng thái
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Ngày mua
        </H5>

        <H5 color='grey.600' my={0} mx={0.75} textAlign='left'>
          Tổng tiền
        </H5>

        <H5
          my={0}
          px={2.75}
          color='grey.600'
          flex='0 0 0 !important'
          display={{ xs: 'none', md: 'block' }}
        />
      </TableRow>

      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant='rectangular'
              animation='wave'
              width='100%'
              height={50}
              sx={{
                borderRadius: '8px',
                my: '1rem',
              }}
            />
          ))
        : orderList.map((order) => <OrderRow order={order} key={order.id} />)}

      <FlexBox justifyContent='center' mt={5}>
        <Pagination
          count={5}
          color='primary'
          variant='outlined'
          onChange={(data) => console.log(data)}
        />
      </FlexBox>
    </Fragment>
  );
};

export default OrderViewer;
