import { Box, Card, Table, TableBody, TableContainer } from '@mui/material';
import type { FC } from 'react';
import { Fragment } from 'react';

import ExportOrderDetailRow from './ExportOrderDetailRow';

import type { ExportOrderDetails } from 'backend/services/customerOrder/helper';
import TableHeader from 'components/data-table/TableHeader';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';

const tableHeading = [
  { id: 'importDate', label: 'Ngày nhập', align: 'left' },
  { id: 'expirationDate', label: 'Ngày hết hạn', align: 'left' },
  { id: 'productName', label: 'Sản phẩm xuất', align: 'left' },
  { id: 'quantity', label: 'Số lượng xuất', align: 'center' },
];

type Props = {
  exportOrderDetails: ExportOrderDetails[];
};

const ExportOrderDetailTable: FC<Props> = ({ exportOrderDetails }: Props) => {
  const { order, selected, filteredList } = useMuiTable({
    listData: exportOrderDetails || [],
  });

  return (
    <Fragment>
      <Box>
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
                  {(filteredList as ExportOrderDetails[]).map(
                    (exportOrderDetail) => (
                      <ExportOrderDetailRow
                        key={exportOrderDetail.exportOrderId}
                        exportOrderDetails={exportOrderDetail}
                      />
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Box>
    </Fragment>
  );
};

export default ExportOrderDetailTable;
