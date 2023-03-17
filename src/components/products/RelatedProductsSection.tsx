import { Box, Grid } from '@mui/material';
import type { FC } from 'react';

import type { IProduct } from 'api/models/Product.model/types';
import { H3 } from 'components/abstract/Typography';
import ProductCard from 'components/product-item/ProductCard';

// ===================================================
type RelatedProductsProps = { products: IProduct[] };
// ===================================================

const RelatedProductsSection: FC<RelatedProductsProps> = ({ products }) => {
  return (
    <Box mb={7.5}>
      <H3 mb={3}>Các sản phẩm liên quan</H3>
      <Grid container spacing={8}>
        {products.map((product: IProduct, index) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProductsSection;
