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
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';

import { checkContextCredentials } from 'api/helpers/auth.helper';
import type { ICdsUpeProduct } from 'api/models/Product.model/types';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { getMaxUpeQuantity } from 'helpers/product.helper';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { useTableSearch } from 'hooks/useTableSearch';
import { ProductRow } from 'pages-sections/admin';
import apiCaller from 'api-callers/admin/product';

ProductList.getLayout = function getLayout(page: ReactElement) {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};

const tableHeading = [
  { id: 'name', label: 'Tên sản phẩm', align: 'left' },
  { id: 'category', label: 'Danh mục', align: 'left' },
  { id: 'wholesalePrice', label: 'Giá gốc', align: 'left' },
  { id: 'retailPrice', label: 'Giá bán', align: 'left' },
  { id: 'shelfLife', label: 'Tồn kho', align: 'left' },
];

const mapProductToRow = (item: ICdsUpeProduct) => ({
  id: item.id,
  // shelfLife: item.shelfLife,
  unexpiredAmount: getMaxUpeQuantity(item.expirations),
  imageUrls: item.imageUrls,
  name: item.name,
  category: item.category.name,
  wholesalePrice: item.wholesalePrice,
  retailPrice: item.retailPrice,
});

export type FilteredProduct = ReturnType<typeof mapProductToRow>;

function ProductList() {
  const router = useRouter();

  const {
    isLoading,
    paginationData: products,
    paginationComponent,
  } = usePaginationQuery<ICdsUpeProduct>({
    baseQueryKey: ['admin/products'],
    getPaginationDataFn: (currPageNum) => apiCaller.getProducts(currPageNum),
  });

  const {
    handleSearch,
    filteredList: filteredProducts,
    searchQuery,
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

  return (
    <Box py={4}>
      <H3 mb={2}>Sản phẩm</H3>

      <SearchArea
        handleSearch={handleSearch}
        searchPlaceholder='Tìm theo tên sản phẩm'
        haveButton
        handleBtnClick={() => router.push('/admin/product/create')}
        buttonText='Thêm sản phẩm'
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isNotAuthorized, blockingResult } =
    await checkContextCredentials(context);
  if (isNotAuthorized) return blockingResult;

  return { props: {} };
};

export default ProductList;
