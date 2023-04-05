import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredSupplier } from '../../../../pages/admin/supplier';
import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import { Paragraph } from 'components/abstract/Typography';

type SupplierRowProps = { supplier: FilteredSupplier };

const SupplierRow: FC<SupplierRowProps> = ({ supplier }) => {
  const { phone, email, name, id } = supplier;

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(`/admin/supplier/${id}`)}
    >
      {/* <StyledTableCell align='left'>{id.slice(-6)}</StyledTableCell> */}

      <StyledTableCell align='left'>
        <Paragraph>{name}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <Paragraph>{phone}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <Paragraph>{email}</Paragraph>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default SupplierRow;
