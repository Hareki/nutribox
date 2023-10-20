import { East } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';

import { H5 } from 'components/abstract/Typography';
import TableRow from 'components/data-table/TableRow';
import OrderStatusChip from 'components/orders/OrderStatusChip';
import { ORDER_DETAIL_ROUTE } from 'constants/routes.ui.constant';
import { formatCurrency, formatDateTime } from 'lib';
import type { CustomerOrderModel } from 'models/customerOrder.model';
import { insertId } from 'utils/middleware.helper';

type OrderRowProps = {
  order: CustomerOrderModel;
};
const OrderRow: FC<OrderRowProps> = ({ order }) => {
  return (
    <Link href={insertId(ORDER_DETAIL_ROUTE, order.id)} passHref>
      <TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
        <H5 m={0.75} textAlign='left'>
          {order.id.slice(-6)}
        </H5>

        <Box m={0.75}>
          <OrderStatusChip statusObjId={order.status} />
        </Box>

        <Typography className='pre' m={0.75} textAlign='left'>
          {formatDateTime(new Date(order.createdAt))}
        </Typography>

        <Typography m={0.75} textAlign='left'>
          {formatCurrency(order.total)}
        </Typography>

        <Typography
          color='grey.600'
          textAlign='center'
          sx={{
            flex: '0 0 0 !important',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <IconButton>
            <East fontSize='small' color='inherit' />
          </IconButton>
        </Typography>
      </TableRow>
    </Link>
  );
};

export default OrderRow;
