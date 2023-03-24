import { Button, Card } from '@mui/material';
import type { FC } from 'react';

import DataListTable from './table';

import { H5 } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';

// table column list
const tableHeading = [
  { id: 'orderId', label: 'Order ID', alignRight: false },
  { id: 'product', label: 'Product', alignRight: false },
  { id: 'payment', label: 'Payment', alignRight: false },
  { id: 'amount', label: 'Amount', alignCenter: true },
];

// ===================================================
type RecentPurchaseProps = { data: any[] };
// ===================================================

const RecentPurchase: FC<RecentPurchaseProps> = ({ data }) => {
  return (
    <Card>
      <FlexBetween px={3} py={2.5}>
        <H5>Đơn hàng gần đây</H5>

        <Button size='small' color='primary' variant='outlined'>
          Tất cả đơn hàng
        </Button>
      </FlexBetween>

      <DataListTable
        dataList={data}
        tableHeading={tableHeading}
        type='RECENT_PURCHASE'
      />
    </Card>
  );
};

export default RecentPurchase;
