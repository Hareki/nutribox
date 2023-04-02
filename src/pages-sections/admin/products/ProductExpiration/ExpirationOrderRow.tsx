import type { FC } from 'react';

import type { ExpirationOrder } from '../../../../../pages/api/admin/product/expiration-order';
import { StyledTableRow, StyledTableCell } from '../../StyledComponents';

import { Paragraph } from 'components/abstract/Typography';
import { formatDate } from 'lib';

type ExpirationOrderRowProps = { expirationOrder: ExpirationOrder };

const ExpirationOrderRow: FC<ExpirationOrderRowProps> = ({
  expirationOrder,
}) => {
  const {
    expirationDate,
    importDate,
    importQuantity,
    remainingQuantity,
    supplierName,
  } = expirationOrder;

  const hasExpired = new Date(expirationDate as string) < new Date();

  return (
    <StyledTableRow cursor='auto' tabIndex={-1}>
      <StyledTableCell align='left' font_weight={400}>
        <Paragraph>{supplierName}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left' font_weight={400}>
        {formatDate(importDate as string)}
      </StyledTableCell>

      <StyledTableCell align='left' font_weight={400}>
        <Paragraph color={hasExpired ? 'error.500' : ''}>
          {formatDate(expirationDate as string)}
        </Paragraph>
      </StyledTableCell>

      <StyledTableCell align='center' font_weight={400}>
        <Paragraph>{importQuantity}</Paragraph>
      </StyledTableCell>
      <StyledTableCell align='center' font_weight={400}>
        <Paragraph>{remainingQuantity}</Paragraph>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ExpirationOrderRow;
