import { styled, Table, TableContainer, Tooltip } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import TableHeader from './TableHeader';

import type { ManagerDashboardData } from 'backend/services/dashboard/helper';
import Scrollbar from 'components/Scrollbar';
import {
  CUSTOMER_ORDER_DETAIL_STAFF_ROUTE,
  PRODUCT_DETAIL_STAFF_ROUTE,
} from 'constants/routes.ui.constant';
import { getFullName } from 'helpers/account.helper';
import useMuiTable from 'hooks/useMuiTable';
import { formatCurrency } from 'lib';
import { StyledTableRow } from 'pages-sections/admin';
import { insertId } from 'utils/middleware.helper';
import { shortenString } from 'utils/string.helper';

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

  const router = useRouter();

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
                  <StyledTableRow
                    key={index}
                    role='checkbox'
                    onClick={() =>
                      router.push(
                        insertId(CUSTOMER_ORDER_DETAIL_STAFF_ROUTE, id),
                      )
                    }
                  >
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
                const { name, remainingStock, productCategory, id } =
                  row as ManagerDashboardData['fiveLeastInStockProduct'][number];

                return (
                  <StyledTableRow
                    key={index}
                    onClick={() => {
                      router.push(insertId(PRODUCT_DETAIL_STAFF_ROUTE, id));
                    }}
                  >
                    <Tooltip placement='top' title={name}>
                      <StyledTableCell align='left'>
                        {shortenString(name, 40)}
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
