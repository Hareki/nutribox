import { styled, Table, TableContainer, Tooltip } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import type { FC } from 'react';

import TableHeader from './TableHeader';

import type { IAccount } from 'api/models/Account.model/types';
import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import type { IProductWithTotalQuantity } from 'api/models/Product.model/types';
import type { IProductCategory } from 'api/models/ProductCategory.model/types';
import Scrollbar from 'components/Scrollbar';
import useMuiTable from 'hooks/useMuiTable';
import { formatCurrency } from 'lib';

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
  dataList: ICustomerOrder[] | IProductWithTotalQuantity[];
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
                const { id, account, phone, total } = row as ICustomerOrder;

                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell align='left'>
                      {id.slice(-6)}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {(account as unknown as IAccount).fullName}
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
                const { name, totalQuantity, category } =
                  row as IProductWithTotalQuantity;

                return (
                  <StyledTableRow key={index}>
                    <Tooltip placement='top' title={name}>
                      <StyledTableCell align='left'>
                        {name.slice(0, 30).concat('...')}
                      </StyledTableCell>
                    </Tooltip>

                    <StyledTableCell align='left'>
                      {(category as unknown as IProductCategory).name}
                    </StyledTableCell>

                    <StyledTableCell
                      align='center'
                      sx={{ color: 'error.main' }}
                    >
                      {totalQuantity}
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
