import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredEmployee } from '../../../../pages/staff/employees';
import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import DisabledStatusChip from './DisabledStatusChip';
import RoleChip from './RoleChip';

import { Paragraph } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';
import { EMPLOYEE_DETAIL_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { formatDate } from 'lib';
import { insertId } from 'utils/middleware.helper';

type EmployeeRowProps = { employee: FilteredEmployee; isSelf: boolean };

const EmployeeRow: FC<EmployeeRowProps> = ({ employee, isSelf }) => {
  const { role, disabled, fullName, id, personalId, birthday, avatarUrl } =
    employee;

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      sx={{
        backgroundColor: isSelf ? 'warning.100' : undefined,
      }}
      onClick={() => router.push(insertId(EMPLOYEE_DETAIL_STAFF_ROUTE, id))}
    >
      <StyledTableCell align='left'>
        <FlexBox alignItems='center' gap={1.5}>
          <Avatar
            src={avatarUrl}
            sx={{
              '& img': {
                objectFit: 'contain',
              },
            }}
          />
          <Paragraph>{fullName}</Paragraph>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <Paragraph>{formatDate(birthday)}</Paragraph>
      </StyledTableCell>

      <StyledTableCell align='left'>
        <RoleChip employeeRole={role} />
      </StyledTableCell>

      <StyledTableCell align='left'>
        <Paragraph>{personalId}</Paragraph>
      </StyledTableCell>

      {disabled !== null && (
        <StyledTableCell align='left'>
          <DisabledStatusChip disabled={disabled} />
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
};

export default EmployeeRow;
