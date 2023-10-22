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
import { Fragment, useState } from 'react';

import ExpirationOrderModal from './ExpirationOrderModal';
import ExpirationOrderRow from './ExpirationOrderRow';

import apiCaller from 'api-callers/staff/products';
import type { ExtendedCommonProductModel } from 'backend/services/product/helper';
import TableHeader from 'components/data-table/TableHeader';
import { FlexBox } from 'components/flex-box';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';
import usePaginationQuery from 'hooks/usePaginationQuery';
import type { ImportOrderModel } from 'models/importOder.model';

const tableHeading = [
  { id: 'supplierName', label: 'Nhà cung cấp', align: 'left' }, // supplier
  { id: 'importDate', label: 'Ngày nhập', align: 'left' }, // Created at of product order
  { id: 'expirationDate', label: 'Ngày hết hạn', align: 'left' }, // expirationDate of expiration
  { id: 'importQuantity', label: 'Số lượng', align: 'center' }, // quantity of product Order
  { id: 'remainingQuantity', label: 'Tồn kho', align: 'center' }, // quantity of expiration
];

interface ProductExpirationProps {
  product: ExtendedCommonProductModel;
}
const ProductExpiration = ({ product }: ProductExpirationProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    isLoading,
    paginationData: expirationOrdersPagination,
    paginationComponent,
  } = usePaginationQuery<ImportOrderModel>({
    baseQueryKey: ['staff', 'import-orders', product.id],
    getPaginationDataFn: apiCaller.getImportOrders,
    otherArgs: product.id,
  });

  const { selected, filteredList } = useMuiTable({
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
            height='300px'
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
