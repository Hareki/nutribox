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
import type { ISupplier } from 'api/models/Supplier.model/types';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import SupplierRow from 'pages-sections/admin/supplier/SupplierRow';
import apiCaller from 'utils/apiCallers/admin/supplier';

SupplierList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  // { id: 'id', label: 'Mã #', align: 'left' },
  { id: 'name', label: 'Tên nhà CC', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
];

const mapOrderToRow = (item: ISupplier) => ({
  id: item.id,
  name: item.name,
  phone: item.phone,
  email: item.email,
});

export type FilteredSupplier = ReturnType<typeof mapOrderToRow>;

function SupplierList() {
  const {
    isLoading,
    paginationData: suppliers,
    paginationComponent,
  } = usePaginationQuery<ISupplier>({
    baseQueryKey: ['admin/suppliers'],
    getPaginationDataFn: (currPageNum) => apiCaller.getSuppliers(currPageNum),
  });

  const filteredAccounts = suppliers?.docs.map(mapOrderToRow);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: filteredAccounts,
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Nhà cung cấp</H3>

      <SearchArea
        handleSearch={() => {}}
        searchPlaceholder='Tìm theo tên nhà CC'
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
                  orderBy={orderBy}
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {filteredList.map((supplier) => (
                    <SupplierRow supplier={supplier} key={supplier.id} />
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

export default SupplierList;
