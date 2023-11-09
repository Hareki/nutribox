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

import staffCategoryCaller from 'api-callers/staff/categories';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { NEW_CATEGORY_ROUTE } from 'constants/routes.ui.constant';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import type { ProductCategoryModel } from 'models/productCategory.model';
import CategoryRow from 'pages-sections/staff/category/CategoryRow';

CategoryList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'name', label: 'Họ và tên', align: 'left' },
  { id: 'available', label: 'Kinh doanh', align: 'left' },
];

const mapCategoryToRow = (item: ProductCategoryModel) => {
  const result = {
    id: item.id,
    name: item.name,
    available: item.available,
  };

  return result;
};

export type FilteredCategory = ReturnType<typeof mapCategoryToRow>;
function CategoryList() {
  const router = useRouter();

  const {
    isLoading,
    paginationData: categories,
    paginationComponent,
  } = usePaginationQuery<ProductCategoryModel>({
    baseQueryKey: ['staff', 'categories'],
    getPaginationDataFn: (currPageNum) =>
      staffCategoryCaller.getCategories(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredCategories,
    searchQuery,
    isSearching,
  } = useTableSearch({
    mapItemToRow: mapCategoryToRow,
    paginationResult: categories,
    queryFn: (context) =>
      staffCategoryCaller.searchCategoriesByName(context.queryKey[2]),
  });

  const { order, selected, filteredList } = useMuiTable({
    listData: filteredCategories,
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Danh mục</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo tên danh mục'
        haveButton
        handleBtnClick={() => router.push(NEW_CATEGORY_ROUTE)}
        buttonText='Thêm danh mục'
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
                  {filteredList.map((category) => (
                    <CategoryRow category={category} key={category.id} />
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

export default CategoryList;
