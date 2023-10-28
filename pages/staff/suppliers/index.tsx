import {
  Box,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import staffSupplierCaller from 'api-callers/staff/suppliers';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { NEW_SUPPLIER_ROUTE } from 'constants/routes.ui.constant';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import type { SupplierModel } from 'models/supplier.model';
import SupplierRow from 'pages-sections/staff/supplier/SupplierRow';

SupplierList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  // { id: 'id', label: 'Mã #', align: 'left' },
  { id: 'name', label: 'Tên nhà CC', align: 'left' },
  { id: 'phone', label: 'Số điện thoại', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
];

const mapSupplierToRow = (item: SupplierModel) => ({
  id: item.id,
  name: item.name,
  phone: item.phone,
  email: item.email,
});

export type FilteredSupplier = ReturnType<typeof mapSupplierToRow>;
function SupplierList() {
  const router = useRouter();

  const {
    isLoading,
    paginationData: suppliers,
    paginationComponent,
  } = usePaginationQuery<SupplierModel>({
    baseQueryKey: ['staff', 'suppliers'],
    getPaginationDataFn: (currPageNum) =>
      staffSupplierCaller.getSuppliers(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredSupplier,
    searchQuery,
  } = useTableSearch({
    mapItemToRow: mapSupplierToRow,
    paginationResult: suppliers,
    queryFn: (context) =>
      staffSupplierCaller.searchSuppliersByName(context.queryKey[2]),
  });

  const { order, selected, filteredList } = useMuiTable({
    listData: filteredSupplier,
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Nhà cung cấp</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo tên nhà CC'
        haveButton
        handleBtnClick={() => router.push(NEW_SUPPLIER_ROUTE)}
        buttonText='Thêm nhà CC'
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
                  {filteredList.map((supplier) => (
                    <SupplierRow supplier={supplier} key={supplier.id} />
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

export default SupplierList;
