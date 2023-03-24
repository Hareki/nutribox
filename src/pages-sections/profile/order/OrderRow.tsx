import { East } from '@mui/icons-material';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';

import type { ICustomerOrder } from 'api/models/CustomerOrder.model/types';
import { H5 } from 'components/abstract/Typography';
import TableRow from 'components/data-table/TableRow';
import { getOrderStatusName } from 'helpers/order.helper';
import { formatCurrency, formatDate } from 'lib';
import { OrderStatus } from 'utils/constants';

type OrderRowProps = {
  order: ICustomerOrder;
};
const OrderRow: FC<OrderRowProps> = ({ order }) => {
  const statusId = useMemo(() => {
    return order.status.toString();
  }, [order.status]);
  const statusName = getOrderStatusName(statusId);

  const getColor = () => {
    switch (statusId) {
      case OrderStatus.Pending.name:
        return 'secondary';

      case OrderStatus.Processing.name:
        return 'secondary';

      case OrderStatus.Delivered.name:
        return 'success';

      case OrderStatus.Cancelled.name:
        return 'error';

      case OrderStatus.Delivering.name:
        return 'paste';

      default:
        return '';
    }
  };

  return (
    <Link href={`/profile/order/${order.id}`} passHref>
      <TableRow sx={{ my: '1rem', padding: '6px 18px' }}>
        <H5 m={0.75} textAlign='left'>
          {order.id.slice(-6)}
        </H5>

        <Box m={0.75}>
          <Chip
            size='small'
            label={statusName}
            sx={{
              p: '0.25rem 0.5rem',
              fontSize: 12,
              color: getColor() ? `${getColor()}.900` : 'inherit',
              backgroundColor: getColor() ? `${getColor()}.100` : 'none',
            }}
          />
        </Box>

        <Typography className='pre' m={0.75} textAlign='left'>
          {formatDate(order.createdAt)}
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
