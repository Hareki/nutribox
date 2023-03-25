import { Card, Divider, Tooltip } from '@mui/material';
import type { FC } from 'react';
import { Fragment } from 'react';
import React from 'react';

import type { StatisticProduct } from '../../../pages/api/admin/dashboard';

import { H3, Paragraph } from 'components/abstract/Typography';
import { FlexBetween, FlexBox } from 'components/flex-box';

type StatisticProductCardProps = {
  title: string;
  soldProducts: StatisticProduct[];
  type: 'most' | 'least';
};

const StatisticProductCard: FC<StatisticProductCardProps> = (props) => {
  const { title, type, soldProducts } = props;

  const totalSold = soldProducts[0].totalSold;
  const totalSoldOfAllProducts = soldProducts[0].totalSoldOfAllProducts;
  const productNames = soldProducts.map((statistic) => statistic.product.name);
  const productNamesUL = productNames.map((name) => <li key={name}>{name}</li>);

  const percentage = (100 * totalSold) / totalSoldOfAllProducts;
  const description = (
    <Fragment>
      <ol style={{ padding: '0 1rem' }}>{productNamesUL}</ol>
      <Divider />
      <p>
        Số sản phẩm bán được: {totalSold} trong tổng số {totalSoldOfAllProducts}{' '}
        sản phẩm đã bán, chiếm {percentage.toFixed(2)}%.
      </p>
    </Fragment>
  );
  return (
    <Tooltip title={description}>
      <Card sx={{ p: 2 }}>
        <Fragment>
          <Paragraph mb={1} color='grey.600'>
            {title}
          </Paragraph>
          <H3 mb={0.3}>{totalSold}</H3>

          {type && (
            <FlexBetween>
              <Paragraph ellipsis fontWeight={500} color='grey.500'>
                {productNames.length > 1
                  ? `${productNames.length} sản phẩm`
                  : productNames[0]}
              </Paragraph>

              <FlexBox
                alignItems='center'
                color={type === 'most' ? 'success.main' : 'error.main'}
              >
                <Paragraph fontSize={12}>{percentage.toFixed(2)}%</Paragraph>
              </FlexBox>
            </FlexBetween>
          )}
        </Fragment>
      </Card>
    </Tooltip>
  );
};

export default StatisticProductCard;
