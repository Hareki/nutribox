import type { FC } from 'react';

import { StyledTableRow, StyledTableCell } from '../../StyledComponents';

import { Paragraph } from 'components/abstract/Typography';
import { formatDate } from 'lib';
import type { PopulateImportOrderFields } from 'models/importOder.model';

type ExpirationOrderRowProps = {
  expirationOrder: PopulateImportOrderFields<'supplier'>;
};

const ExpirationOrderRow: FC<ExpirationOrderRowProps> = ({
  expirationOrder,
}) => {
  const {
    expirationDate,
    importDate,
    importQuantity,
    remainingQuantity,
    supplier,
  } = expirationOrder;

  const hasExpired = new Date(expirationDate) < new Date();

  return (
    <StyledTableRow cursor='auto' tabIndex={-1}>
      <StyledTableCell align='left' font_weight={400}>
        <Paragraph>{supplier.name}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left' font_weight={400}>
        {formatDate(importDate)}
      </StyledTableCell>

      <StyledTableCell align='left' font_weight={400}>
        <Paragraph color={hasExpired ? 'error.500' : ''}>
          {formatDate(expirationDate)}
        </Paragraph>
      </StyledTableCell>

      <StyledTableCell align='center' font_weight={400}>
        <Paragraph>{importQuantity}</Paragraph>
      </StyledTableCell>
      <StyledTableCell align='center' font_weight={400}>
        <Paragraph
          color={hasExpired && remainingQuantity > 0 ? 'error.500' : ''}
        >
          {remainingQuantity}
        </Paragraph>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ExpirationOrderRow;
