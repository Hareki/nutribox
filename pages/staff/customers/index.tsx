import {
  Box,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import type { ReactElement } from 'react';

import staffCustomerCaller from 'api-callers/staff/customers';
import type { CustomerWithTotalOrders } from 'backend/services/customer/helper';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { getAvatarUrl, getFullName } from 'helpers/account.helper';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import CustomerRow from 'pages-sections/staff/customer/CustomerRow';

AccountList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'name', label: 'Họ và tên', align: 'left' },
  { id: 'birthday', label: 'Ngày sinh', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'totalOrders', label: 'Tổng số đơn', align: 'center' },
];

const mapAccountToRow = (item: CustomerWithTotalOrders) => ({
  id: item.id,
  lastName: item.lastName,
  firstName: item.firstName,

  fullName: getFullName(item),
  avatarUrl: getAvatarUrl(item),
  birthday: item.birthday,
  phone: item.phone,
  email: item.email,
  totalOrders: item.totalOrders,
});

export type FilteredAccount = ReturnType<typeof mapAccountToRow>;

function AccountList() {
  const {
    isLoading,
    paginationData: accounts,
    paginationComponent,
  } = usePaginationQuery<CustomerWithTotalOrders>({
    baseQueryKey: ['staff', 'customers'],
    getPaginationDataFn: (currPageNum) =>
      staffCustomerCaller.getCustomers(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredAccounts,
    searchQuery,
  } = useTableSearch({
    mapItemToRow: mapAccountToRow,
    paginationResult: accounts,
    queryFn: (context) =>
      staffCustomerCaller.searchCustomersByName(context.queryKey[2]),
  });

  const {
    order,
    // orderBy,
    selected,
    // rowsPerPage,
    filteredList,
    // handleChangePage,
    // handleRequestSort,
  } = useMuiTable({
    listData: filteredAccounts,
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Tài khoản</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo họ tên khách hàng'
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
                  // orderBy={orderBy}
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                  // onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {filteredList.map((account) => (
                    <CustomerRow account={account} key={account.id} />
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

export default AccountList;
