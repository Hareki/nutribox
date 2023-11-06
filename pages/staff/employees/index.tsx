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
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';

import staffEmployeeCaller from 'api-callers/staff/employees';
import type { CommonEmployeeModel } from 'backend/services/employee/helper';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { NEW_EMPLOYEE_ROUTE } from 'constants/routes.ui.constant';
import { getAvatarUrl, getFullName } from 'helpers/account.helper';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import EmployeeRow from 'pages-sections/staff/employee/EmployeeRow';

EmployeeList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'name', label: 'Họ và tên', align: 'left' },
  { id: 'birthday', label: 'Ngày sinh', align: 'left' },
  { id: 'role', label: 'Chức vụ', align: 'left' },
  { id: 'personalId', label: 'Số CCCD', align: 'left' },
  { id: 'disabled', label: 'Trạng thái', align: 'left' },
];

const mapEmployeeToRow = (item: CommonEmployeeModel) => {
  const result = {
    id: item.id,
    disabled: item.account?.disabled ?? null,
    fullName: getFullName(item),
    birthday: item.birthday,
    personalId: item.personalId,
    avatarUrl: getAvatarUrl(item),
    role: item.role,
  };

  return result;
};

export type FilteredEmployee = ReturnType<typeof mapEmployeeToRow>;
function EmployeeList() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    isLoading,
    paginationData: employees,
    paginationComponent,
  } = usePaginationQuery<CommonEmployeeModel>({
    baseQueryKey: ['staff', 'employees'],
    getPaginationDataFn: (currPageNum) =>
      staffEmployeeCaller.getEmployees(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredEmployees,
    searchQuery,
    isSearching,
  } = useTableSearch({
    mapItemToRow: mapEmployeeToRow,
    paginationResult: employees,
    queryFn: (context) =>
      staffEmployeeCaller.searchEmployeesByName(context.queryKey[2]),
  });

  const { order, selected, filteredList } = useMuiTable({
    listData: filteredEmployees,
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Nhân viên</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo tên nhân viên'
        haveButton
        handleBtnClick={() => router.push(NEW_EMPLOYEE_ROUTE)}
        buttonText='Thêm nhân viên'
      />

      {isLoading || isSearching ? (
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
                  {filteredList.map((employee) => (
                    <EmployeeRow
                      isSelf={
                        session?.employeeAccount.employee.id === employee.id
                      }
                      employee={employee}
                      key={employee.id}
                    />
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

export default EmployeeList;
