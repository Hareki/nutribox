import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import ProductCard from 'components/product-item/ProductCard';
import { H3 } from 'components/Typography';
import Product from 'models/Product.model';

// ===================================================
type RelatedProductsProps = { productsData: Product[] };
// ===================================================

const RelatedProductsSection: FC<RelatedProductsProps> = ({ productsData }) => {
  return (
    <Box mb={7.5}>
      <H3 mb={3}>Related Products</H3>
      <Grid container spacing={8}>
        {productsData.map((item, index) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={index}>
            <ProductCard
              id={item.id}
              slug={item.slug}
              title={item.title}
              price={item.price}
              rating={item.rating}
              imgUrl={item.thumbnail}
              off={item.discount}
              hoverEffect
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RelatedProductsSection;