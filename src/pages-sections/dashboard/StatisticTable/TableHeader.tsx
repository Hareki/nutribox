import { styled, TableCell, TableHead, TableRow } from '@mui/material';
import type { FC } from 'react';
import React from 'react';

// styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: '12px 16px',
  color: theme.palette.grey[900],
  ':first-of-type': { paddingLeft: 24 },
}));

// ----------------------------------------------------------------------
type TableHeaderProps = {
  heading: any[];
  orderBy?: string;
  order?: 'asc' | 'desc';
  onRequestSort?: (id: string) => void;
};
// ----------------------------------------------------------------------

const TableHeader: FC<TableHeaderProps> = (props) => {
  const { heading } = props;

  return (
    <TableHead sx={{ backgroundColor: 'grey.200' }}>
      <TableRow>
        {heading.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.alignCenter ? 'center' : 'left'}
          >
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
