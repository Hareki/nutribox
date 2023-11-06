import { Chip } from '@mui/material';

import { EmployeeRole } from 'backend/enums/entities.enum';
import { getUserRoleName } from 'helpers/order.helper';

interface Props {
  employeeRole: EmployeeRole;
}
const RoleChip = ({ employeeRole }: Props) => {
  const statusName = getUserRoleName(employeeRole);

  return (
    <Chip
      size='small'
      label={statusName}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(employeeRole)
          ? `${getColor(employeeRole)}.900`
          : 'inherit',
        backgroundColor: getColor(employeeRole)
          ? `${getColor(employeeRole)}.100`
          : 'none',
      }}
    />
  );
};

const getColor = (employeeRole: EmployeeRole) => {
  switch (employeeRole) {
    case EmployeeRole.MANAGER:
      return 'secondary';

    case EmployeeRole.CASHIER:
      return 'blue';

    case EmployeeRole.WAREHOUSE_MANAGER:
      return 'success';

    case EmployeeRole.WAREHOUSE_STAFF:
      return 'error';

    case EmployeeRole.SHIPPER:
      return 'paste';

    default:
      return '';
  }
};

export default RoleChip;
