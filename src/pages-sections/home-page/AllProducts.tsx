import { Button, Grid, styled } from '@mui/material';
import { FC } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import CategorySectionCreator from 'components/CategorySectionCreator';
import { FlexRowCenter } from 'components/flex-box';
import ProductCard from 'components/product-item/ProductCard';
import { Paragraph } from 'components/Typography';

const SubTitle = styled(Paragraph)(({ theme }) => ({
  fontSize: 12,
  marginTop: '-20px',
  marginBottom: '20px',
  color: theme.palette.grey[600],
}));

// ========================================================
type AllProductsProps = {
  products: IProduct[];
  title?: string;
  subtitle?: string;
};
// ========================================================

const AllProducts: FC<AllProductsProps> = ({
  products,
  title = 'Tất cả món ăn',
  subtitle,
}) => {
  return (
    <CategorySectionCreator title={title} seeMoreLink='#'>
      {subtitle && <SubTitle>{subtitle}</SubTitle>}

      <Grid container spacing={3}>
        {products.map((item) => (
          <Grid key={item._id.toString()} item md={4} sm={6} xs={12}>
            <ProductCard product={item} />
          </Grid>
        ))}
      </Grid>

      <FlexRowCenter mt={6}>
        <Button variant='contained' color='primary' sx={{ fontSize: 13 }}>
          Load More...
        </Button>
      </FlexRowCenter>
    </CategorySectionCreator>
  );
};

export default AllProducts;
