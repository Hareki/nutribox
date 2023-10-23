import { useRouter } from 'next/router';
import type { FC } from 'react';

import type { FilteredOrder } from '../../../../pages/staff/customer-orders';
import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import OrderStatusChip from 'components/orders/OrderStatusChip';
import { CUSTOMER_ORDER_DETAIL_STAFF_ROUTE } from 'constants/routes.ui.constant';
import { formatCurrency, formatDateTime } from 'lib';
import { insertId } from 'utils/middleware.helper';

type OrderRowProps = { order: FilteredOrder };

const OrderRow: FC<OrderRowProps> = ({ order }) => {
  const { id, status, total, createdAt, phone } = order;

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() =>
        router.push(insertId(CUSTOMER_ORDER_DETAIL_STAFF_ROUTE, id))
      }
    >
      <StyledTableCell align='left'>{id.slice(-6)}</StyledTableCell>

      <StyledTableCell align='left'>
        <OrderStatusChip statusObjId={status} />
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatDateTime(new Date(createdAt))}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {formatCurrency(total)}
      </StyledTableCell>

      <StyledTableCell align='left' sx={{ fontWeight: 400 }}>
        {phone}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default OrderRow;
