import { ShoppingBag } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { Fragment } from 'react';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H5 } from 'components/abstract/Typography';
import UserDashboardHeader from 'components/common/layout/header/UserDashboardHeader';
import TableRow from 'components/data-table/TableRow';
import { FlexBox } from 'components/flex-box';
import { getCustomerDashboardLayout } from 'components/layouts/customer-dashboard';
import CustomerDashboardNavigation from 'components/layouts/customer-dashboard/Navigations';
import { checkContextCredentials } from 'helpers/session.helper';
import usePaginationQuery from 'hooks/usePaginationQuery';
import OrderRow from 'pages-sections/profile/order/OrderRow';
import apiCaller from 'utils/apiCallers/profile/order';

Order.getLayout = getCustomerDashboardLayout;

interface AddressProps {
  sessionUserId: string;
}

function Order({ sessionUserId }: AddressProps): ReactElement {
  const {
    isLoading,
    paginationData: orderListPagination,
    paginationComponent,
  } = usePaginationQuery<ICustomerOrder>({
    baseQueryKey: ['orders', sessionUserId],
    // FIXME confusing custom hook
    getPaginationDataFn: apiCaller.getOrders,
    otherArgs: sessionUserId,
  });

  return (
    <Fragment>
      <UserDashboardHeader
        title='Đơn hàng của tôi'
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />

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
        : orderListPagination.docs.map((order) => (
            <OrderRow order={order} key={order.id} />
          ))}

      <FlexBox justifyContent='center' mt={5}>
        {paginationComponent}
      </FlexBox>
    </Fragment>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult, session } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  return { props: { sessionUserId: session.user.id } };
};
export default Order;
