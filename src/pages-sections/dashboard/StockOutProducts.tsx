import { Button, Card } from '@mui/material';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

import DataListTable from './StatisticTable';

import type { ProductModelWithStock } from 'backend/services/dashboard/helper';
import { H3 } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';
import { PRODUCTS_STAFF_ROUTE } from 'constants/routes.ui.constant';

// table column list
const tableHeading = [
  { id: 'name', label: 'Sản phẩm', alignRight: false },
  { id: 'category', label: 'Danh mục', alignRight: false },
  { id: 'totalQuantity', label: 'Tồn kho', alignCenter: true },
];

type StockOutProductsProps = { data: ProductModelWithStock[] };

const StockOutProducts: FC<StockOutProductsProps> = ({ data }) => {
  const router = useRouter();
  return (
    <Card sx={{ height: '100%' }}>
      <FlexBetween px={3} py={2.5}>
        <H3>Các sản phẩm sắp hết hàng</H3>

        <Button
          size='small'
          color='primary'
          variant='outlined'
          onClick={() => router.push(PRODUCTS_STAFF_ROUTE)}
        >
          Tất cả sản phẩm
        </Button>
      </FlexBetween>

      <DataListTable
        dataList={data}
        tableHeading={tableHeading}
        type='STOCK_OUT'
      />
    </Card>
  );
};

export default StockOutProducts;
