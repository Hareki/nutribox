import { Chip } from '@mui/material';
import { useMemo } from 'react';

import { getOrderStatusName } from 'helpers/order.helper';
import { OrderStatus } from 'utils/constants';

interface OrderStatusChipProps {
  // This should be Types.ObjectId in mongoose, but since it's too large to import
  // I just use any because I'm not sure does it affect performance or not
  statusObjId: any;
}
const OrderStatusChip = ({ statusObjId }: OrderStatusChipProps) => {
  const statusName = getOrderStatusName(statusObjId.toString());
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
    case OrderStatus.Pending.id:
      return 'secondary';

    case OrderStatus.Processing.id:
      return 'warning';

    case OrderStatus.Delivered.id:
      return 'success';

    case OrderStatus.Cancelled.id:
      return 'error';

    case OrderStatus.Delivering.id:
      return 'paste';

    default:
      return '';
  }
};

export default OrderStatusChip;
