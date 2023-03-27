import { useRouter } from 'next/router';
import type { FC } from 'react';

import { StyledTableCell, StyledTableRow } from '../StyledComponents';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import OrderStatusChip from 'components/orders/OrderStatusChip';
import { formatCurrency, formatDateTime } from 'lib';

type OrderRowProps = { order: ICustomerOrder };

const OrderRow: FC<OrderRowProps> = ({ order }) => {
  const { id, status, total, createdAt, phone } = order;
  console.log('file: OrderRow.tsx:14 - phone:', phone);

  const router = useRouter();

  return (
    <StyledTableRow
      tabIndex={-1}
      role='checkbox'
      onClick={() => router.push(`/admin/order/${id}`)}
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
