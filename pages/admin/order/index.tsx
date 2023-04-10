import {
  Box,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';

import { checkContextCredentials } from 'api/helpers/auth.helper';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import { OrderRow } from 'pages-sections/admin';
import apiCaller from 'utils/apiCallers/admin/order';

OrderList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'id', label: 'Đơn hàng #', align: 'left' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: 'createdAt', label: 'Ngày mua', align: 'left' },
  { id: 'total', label: 'Tổng tiền', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
];

const mapOrderToRow = (item: ICustomerOrder) => ({
  id: item.id,
  status: item.status,
  createdAt: item.createdAt,
  total: item.total,
  phone: item.phone,
});

export type FilteredOrder = ReturnType<typeof mapOrderToRow>;

function OrderList() {
  const {
    isLoading,
    paginationData: orders,
    paginationComponent,
  } = usePaginationQuery<ICustomerOrder>({
    baseQueryKey: ['admin/orders'],
    getPaginationDataFn: (currPageNum) => apiCaller.getOrders(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredOrders,
    searchQuery,
  } = useTableSearch({
    mapItemToRow: mapOrderToRow,
    paginationResult: orders,
    queryFn: (context) => apiCaller.searchOrdersById(context.queryKey[2]),
  });

  const { order, selected, filteredList } = useMuiTable({
    listData: filteredOrders,
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Đơn hàng</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo mã đơn hàng'
        haveButton={false}
      />

      {isLoading ? (
        <Skeleton
          variant='rectangular'
          animation='wave'
          width='1200px'
          height='500px'
          sx={{ borderRadius: '8px' }}
        />
      ) : (
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader
                  order={order}
                  hideSelectBtn
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                />

                <TableBody>
                  {filteredList.map((order) => (
                    <OrderRow order={order} key={order.id} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {!searchQuery && (
            <Stack alignItems='center' my={4}>
              {paginationComponent}
            </Stack>
          )}
        </Card>
      )}
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } = await checkContextCredentials(
    context,
  );
  if (isNotAuthorized) return blockingResult;

  return { props: {} };
};

export default OrderList;
