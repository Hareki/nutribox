import {
  Box,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { ReactElement } from 'react';

import apiCaller from 'api-callers/staff/products';
import { EmployeeRole } from 'backend/enums/entities.enum';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { NEW_PRODUCT_DETAIL_ROUTE } from 'constants/routes.ui.constant';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import { ProductRow } from 'pages-sections/staff';

ProductList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'name', label: 'Tên sản phẩm', align: 'left' },
  { id: 'category', label: 'Danh mục', align: 'left' },
  { id: 'retailPrice', label: 'Giá bán', align: 'center' },
  { id: 'shelfLife', label: 'Ngày sử dụng', align: 'center' },
  { id: 'remainingStock', label: 'Tồn kho', align: 'center' },
];

const mapProductToRow = (item: ExtendedCommonProductModel) => ({
  id: item.id,
  shelfLife: item.shelfLife,
  remainingStock: item.remainingQuantity,
  imageUrls: item.productImages.map((image) => image.imageUrl),
  name: item.name,
  category: item.productCategory.name,
  retailPrice: item.retailPrice,
});

export type FilteredProduct = ReturnType<typeof mapProductToRow>;

function ProductList() {
  const router = useRouter();

  const {
    isLoading,
    paginationData: products,
    paginationComponent,
  } = usePaginationQuery<ExtendedCommonProductModel>({
    baseQueryKey: ['staff', 'products'],
    getPaginationDataFn: (currPageNum) => apiCaller.getProducts(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredProducts,
    searchQuery,
    isSearching,
  } = useTableSearch({
    mapItemToRow: mapProductToRow,
    paginationResult: products,
    queryFn: (context) => apiCaller.searchProductsByName(context.queryKey[2]),
  });

  const { selected, filteredList } = useMuiTable({
    listData: filteredProducts,
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });

  const { data: session } = useSession();
  const isAuthorizedToAdd =
    session?.employeeAccount.employee.role === EmployeeRole.MANAGER;
  return (
    <Box py={4}>
      <H3 mb={2}>Sản phẩm</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo tên sản phẩm'
        haveButton={isAuthorizedToAdd}
        handleBtnClick={() => router.push(NEW_PRODUCT_DETAIL_ROUTE)}
        buttonText='Thêm sản phẩm'
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
                  // order={order}
                  hideSelectBtn
                  // orderBy={orderBy}
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                  // onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {filteredList.map((product) => (
                    <ProductRow product={product} key={product.id} />
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'product',
    'importOrder',
    'common',
  ]);

  return { props: { ...locales } };
};

export default ProductList;
