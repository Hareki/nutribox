import { Chip } from '@mui/material';
import { useMemo } from 'react';

import { OrderStatus } from 'backend/enums/entities.enum';
import { getOrderStatusName } from 'helpers/order.helper';

interface OrderStatusChipProps {
  statusObjId: OrderStatus;
}
const OrderStatusChip = ({ statusObjId }: OrderStatusChipProps) => {
  const statusName = getOrderStatusName(statusObjId);
  const statusId = useMemo(() => {
    return statusObjId.toString();
  }, [statusObjId]);

  return (
    <Chip
      size='small'
      label={statusName}
      sx={{
        p: '0.25rem 0.5rem',
        fontSize: 12,
        fontWeight: 600,
        color: getColor(statusId) ? `${getColor(statusId)}.900` : 'inherit',
        backgroundColor: getColor(statusId)
          ? `${getColor(statusId)}.100`
          : 'none',
      }}
    />
  );
};

const getColor = (statusId: string) => {
  switch (statusId) {
    case OrderStatus.PENDING:
      return 'secondary';

    case OrderStatus.PROCESSING:
      return 'warning';

    case OrderStatus.SHIPPED:
      return 'success';

    case OrderStatus.CANCELLED:
      return 'error';

    case OrderStatus.SHIPPING:
      return 'paste';

    default:
      return '';
  }
};

export default OrderStatusChip;
