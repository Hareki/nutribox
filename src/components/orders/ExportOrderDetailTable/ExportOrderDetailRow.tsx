import type { FC } from 'react';

import type { ExportOrderDetails } from 'backend/services/customerOrder/helper';
import { formatDate } from 'lib';
import { StyledTableCell, StyledTableRow } from 'pages-sections/staff';

type Props = {
  exportOrderDetails: ExportOrderDetails;
};
const ExportOrderDetailRow: FC<Props> = ({ exportOrderDetails }) => {
  const { expirationDate, exportQuantity, importDate, productName } =
    exportOrderDetails;
  return (
    <StyledTableRow cursor='inherit' tabIndex={-1} role='checkbox'>
      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatDate(importDate)}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatDate(expirationDate)}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {productName}
      </StyledTableCell>

      <StyledTableCell align='center' sx={{ fontWeight: 400 }}>
        {exportQuantity}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ExportOrderDetailRow;
