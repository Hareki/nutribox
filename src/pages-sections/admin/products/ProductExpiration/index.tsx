import ImportExportRoundedIcon from '@mui/icons-material/ImportExportRounded';
import {
  Box,
  Button,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import type { ICdsUpeProduct } from 'api/models/Product.model/types';
import { Fragment, useState } from 'react';

import type { ExpirationOrder } from '../../../../../pages/api/admin/product/expiration-order';

import ExpirationOrderModal from './ExpirationOrderModal';
import ExpirationOrderRow from './ExpirationOrderRow';

import apiCaller from 'api-callers/admin/product';
import TableHeader from 'components/data-table/TableHeader';
import { FlexBox } from 'components/flex-box';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';

const tableHeading = [
  { id: 'supplierName', label: 'Nhà cung cấp', align: 'left' }, // supplier
  { id: 'importDate', label: 'Ngày nhập', align: 'left' }, // Created at of product order
  { id: 'expirationDate', label: 'Ngày hết hạn', align: 'left' }, // expirationDate of expiration
  { id: 'importQuantity', label: 'Số lượng', align: 'center' }, // quantity of product Order
  { id: 'remainingQuantity', label: 'Tồn kho', align: 'center' }, // quantity of expiration
];

interface ProductExpirationProps {
  product: ICdsUpeProduct;
}
const ProductExpiration = ({ product }: ProductExpirationProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isLoading,
    paginationData: expirationOrdersPagination,
    paginationComponent,
  } = usePaginationQuery<ExpirationOrder>({
    baseQueryKey: ['admin/order-expiration', product.id],
    getPaginationDataFn: apiCaller.getExpirationOrders,
    otherArgs: product.id,
  });

  const { selected, filteredList, handleChangePage } = useMuiTable({
    listData: expirationOrdersPagination?.docs || [],
    // defaultSort: 'id',
    // defaultOrder: 'desc',
  });
  return (
    <Fragment>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Skeleton
            variant='rectangular'
            animation='wave'
            width='100%'
            height='500px'
            sx={{ borderRadius: '8px' }}
          />
        ) : (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 900 }}>
                <Table>
                  <TableHeader
                    hideSelectBtn
                    heading={tableHeading}
                    numSelected={selected.length}
                    rowCount={filteredList.length}
                  />

                  <TableBody>
                    {filteredList.map((expirationOrder, index) => (
                      <ExpirationOrderRow
                        expirationOrder={expirationOrder}
                        key={index}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Stack alignItems='center' my={4}>
              {paginationComponent}
            </Stack>
            <FlexBox
              gap={2}
              justifyContent='flex-end'
              mb={4}
              mr={6}
              onClick={() => setModalOpen(true)}
            >
              <Button
                variant='contained'
                color='primary'
                startIcon={<ImportExportRoundedIcon />}
                sx={{
                  '& .MuiButton-startIcon > svg': {
                    fontSize: '25px',
                  },
                }}
              >
                Nhập sản phẩm
              </Button>
            </FlexBox>
          </Card>
        )}
      </Box>
      <ExpirationOrderModal
        open={modalOpen}
        setOpen={setModalOpen}
        product={product}
      />
    </Fragment>
  );
};

export default ProductExpiration;
