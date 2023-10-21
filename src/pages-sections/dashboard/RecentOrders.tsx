import { Button, Card } from '@mui/material';
import type { FC } from 'react';

import StatisticTable from './StatisticTable';

import type { ManagerDashboardData } from 'backend/services/dashboard/helper';
import { H3 } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';

// table column list
const tableHeading = [
  { id: 'id', label: 'Mã đơn', alignRight: false },
  { id: 'customerName', label: 'Khách hàng', alignRight: false },
  { id: 'phone', label: 'SĐT', alignRight: false },
  { id: 'total', label: 'Thành tiền', alignCenter: true },
];

type RecentOrdersProps = {
  data: ManagerDashboardData['fiveMostRecentOrders'];
};

const RecentOrders: FC<RecentOrdersProps> = ({ data }) => {
  return (
    <Card>
      <FlexBetween px={3} py={2.5}>
        <H3>Đơn hàng gần đây</H3>

        <Button size='small' color='primary' variant='outlined'>
          Tất cả đơn hàng
        </Button>
      </FlexBetween>

      <StatisticTable
        dataList={data}
        tableHeading={tableHeading}
        type='RECENT_PURCHASE'
      />
    </Card>
  );
};

export default RecentOrders;
