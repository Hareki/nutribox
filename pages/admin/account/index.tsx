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
import type { IAccountWithTotalOrders } from 'api/models/Account.model/types';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { getAvatarUrl } from 'helpers/account.helper';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import AccountRow from 'pages-sections/admin/account/AccountRow';
import apiCaller from 'utils/apiCallers/admin/account';

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

const mapOrderToRow = (item: IAccountWithTotalOrders) => ({
  id: item.id,
  lastName: item.lastName,
  firstName: item.firstName,

  fullName: item.fullName,
  avatarUrl: getAvatarUrl(item),
  birthday: item.birthday,
  phone: item.phone,
  email: item.email,
  totalOrders: item.totalOrders,
});

export type FilteredAccount = ReturnType<typeof mapOrderToRow>;

function AccountList() {
  const {
    isLoading,
    paginationData: accounts,
    paginationComponent,
  } = usePaginationQuery<IAccountWithTotalOrders>({
    baseQueryKey: ['admin/accounts'],
    getPaginationDataFn: (currPageNum) => apiCaller.getAccounts(currPageNum),
  });
  //   console.log('file: index.tsx:56 - AccountList - accounts:', accounts);

  const filteredAccounts = accounts?.docs.map(mapOrderToRow);

  const {
    order,
    // orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    // handleRequestSort,
  } = useMuiTable({
    listData: filteredAccounts,
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });

  console.log('file: index.tsx:73 - AccountList - filteredList:', filteredList);

  return (
    <Box py={4}>
      <H3 mb={2}>Tài khoản</H3>

      <SearchArea
        handleSearch={() => {}}
        searchPlaceholder='Tìm theo tên tài khoản'
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
                    <AccountRow account={account} key={account.id} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Stack alignItems='center' my={4}>
            {paginationComponent}
          </Stack>
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

export default AccountList;
