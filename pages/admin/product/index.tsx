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
import { getServerSession } from 'next-auth';
import type { ReactElement } from 'react';

import { authOptions } from '../../api/auth/[...nextauth]';

import type { ICdsUpeProduct } from 'api/models/Product.model/types';
import { H3 } from 'components/abstract/Typography';
import SearchArea from 'components/dashboard/SearchArea';
import TableHeader from 'components/data-table/TableHeader';
import AdminDashboardLayout from 'components/layouts/admin-dashboard';
import Scrollbar from 'components/Scrollbar';
import { getMaxUpeQuantity } from 'helpers/product.helper';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import { ProductRow } from 'pages-sections/admin';
import apiCaller from 'utils/apiCallers/admin/product';

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

  const filteredOrders = products?.docs.map(mapProductToRow);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: filteredOrders,
    defaultSort: 'id',
    defaultOrder: 'desc',
  });

  return (
    <Box py={4}>
      <H3 mb={2}>Sản phẩm</H3>

      <SearchArea
        handleSearch={() => {}}
        searchPlaceholder='Tìm theo tên sản phẩm'
        haveButton
        handleBtnClick={() => router.push('/admin/products/create')}
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
                  order={order}
                  hideSelectBtn
                  orderBy={orderBy}
                  heading={tableHeading}
                  numSelected={selected.length}
                  rowCount={filteredList.length}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {filteredList.map((product) => (
                    <ProductRow product={product} key={product.id} />
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
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default ProductList;
