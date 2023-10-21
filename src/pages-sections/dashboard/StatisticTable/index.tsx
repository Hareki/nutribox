import { styled, Table, TableContainer, Tooltip } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { FC } from 'react';

import TableHeader from './TableHeader';

import type {
  ManagerDashboardData,
  ProductModelWithStock,
} from 'backend/services/dashboard/helper';
import Scrollbar from 'components/Scrollbar';
import { getFullName } from 'helpers/account.helper';
import useMuiTable from 'hooks/useMuiTable';
import { formatCurrency } from 'lib';
import type { CustomerOrderModel } from 'models/customerOrder.model';

// styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  paddingTop: 16,
  fontWeight: 400,
  paddingBottom: 16,
  color: theme.palette.grey[900],
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  ':first-of-type': { paddingLeft: 24 },
}));

const StyledTableRow = styled(TableRow)({
  ':last-child .MuiTableCell-root': { border: 0 },
});

type ListTableProps = {
  dataList:
    | ManagerDashboardData['fiveMostRecentOrders']
    | ManagerDashboardData['fiveLeastInStockProduct'];
  tableHeading: any[];
  type: 'STOCK_OUT' | 'RECENT_PURCHASE';
};

const StatisticTable: FC<ListTableProps> = ({
  dataList,
  tableHeading,
  type,
}) => {
  const { filteredList } = useMuiTable({
    listData: dataList,
  });

  return (
    <Scrollbar>
      <TableContainer>
        <Table>
          <TableHeader heading={tableHeading} />

          {type === 'RECENT_PURCHASE' && (
            <TableBody>
              {filteredList.map((row, index) => {
                const { id, phone, total, customer } =
                  row as ManagerDashboardData['fiveMostRecentOrders'][number];

                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell align='left'>
                      {id.slice(-6)}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {getFullName(customer)}
                    </StyledTableCell>

                    <StyledTableCell align='left'>{phone}</StyledTableCell>

                    <StyledTableCell align='center'>
                      {formatCurrency(total)}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}

          {type === 'STOCK_OUT' && (
            <TableBody>
              {filteredList.map((row, index) => {
                const { name, remainingStock, productCategory } =
                  row as ManagerDashboardData['fiveLeastInStockProduct'][number];

                return (
                  <StyledTableRow key={index}>
                    <Tooltip placement='top' title={name}>
                      <StyledTableCell align='left'>
                        {name.slice(0, 30).concat('...')}
                      </StyledTableCell>
                    </Tooltip>

                    <StyledTableCell align='left'>
                      {productCategory.name}
                    </StyledTableCell>

                    <StyledTableCell
                      align='center'
                      sx={{ color: 'error.main' }}
                    >
                      {remainingStock}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Scrollbar>
  );
};

export default StatisticTable;
