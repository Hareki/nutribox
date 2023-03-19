import { Delete, Edit } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import type { FC } from 'react';

import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from './StyledComponents';

import { Paragraph } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { formatCurrency } from 'lib';

// ========================================================================
type CustomerRowProps = { customer: any };
// ========================================================================

const CustomerRow: FC<CustomerRowProps> = ({ customer }) => {
  const { email, name, phone, avatar, balance, orders } = customer;

  return (
    <StyledTableRow tabIndex={-1} role='checkbox'>
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar src={avatar} />
          <Paragraph>{name}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {phone}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {email}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatCurrency(balance)}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {orders}
      </StyledTableCell>

      <StyledTableCell align='center'>
        <StyledIconButton>
          <Edit />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default CustomerRow;
