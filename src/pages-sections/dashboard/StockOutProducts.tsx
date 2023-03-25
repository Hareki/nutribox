import { Button, Card } from '@mui/material';
import type { FC } from 'react';
import React from 'react';

import DataListTable from './table';

import type { IProductWithTotalQuantity } from 'api/models/Product.model/types';
import { H3 } from 'components/abstract/Typography';
import { FlexBetween } from 'components/flex-box';

// table column list
const tableHeading = [
  { id: 'product', label: 'Sản phẩm', alignRight: false },
  { id: 'stock', label: 'Danh mục', alignRight: false },
  { id: 'amount', label: 'Tồn kho', alignCenter: true },
];

type StockOutProductsProps = { data: IProductWithTotalQuantity[] };

const StockOutProducts: FC<StockOutProductsProps> = ({ data }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <FlexBetween px={3} py={2.5}>
        <H3>Các sản phẩm sắp hết hàng</H3>

        <Button size='small' color='primary' variant='outlined'>
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
