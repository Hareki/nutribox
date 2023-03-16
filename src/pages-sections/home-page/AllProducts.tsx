import { LoadingButton } from '@mui/lab';
import { Box, Grid, styled } from '@mui/material';
import { FC } from 'react';

import { IProduct } from 'api/models/Product.model/types';
import { Paragraph } from 'components/abstract/Typography';
import CategorySectionCreator from 'components/CategorySectionCreator';
import { FlexBox, FlexRowCenter } from 'components/flex-box';
import LazyImage from 'components/LazyImage';
import ProductCard from 'components/product-item/ProductCard';

const SubTitle = styled(Paragraph)(({ theme }) => ({
  fontSize: 12,
  marginTop: '-20px',
  marginBottom: '20px',
  color: theme.palette.grey[600],
}));

export interface PaginationType {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

// ========================================================
type AllProductsProps = {
  products: IProduct[];
  title?: string;
  subtitle?: string;
  pagination?: PaginationType;
};
// ========================================================

const AllProducts: FC<AllProductsProps> = ({
  products,
  title = 'Tất cả sản phẩm',
  subtitle,
  pagination,
}) => {
  if (!products || products.length === 0)
    return (
      <FlexBox
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
      >
        <LazyImage
          width={90}
          height={100}
          alt='banner'
          src='/assets/images/logos/shopping-bag.svg'
        />
        <Box
          component='p'
          mt={2}
          color='grey.600'
          textAlign='center'
          maxWidth='400px'
        >
          Hiện chưa có sản phẩm nào thuộc danh mục này, hãy quay lại sau bạn
          nhé!
        </Box>
      </FlexBox>
    );
  const productsJSX = (products ?? []).map((item) => (
    <Grid key={item._id.toString()} item md={4} sm={6} xs={12}>
      <ProductCard product={item} />
    </Grid>
  ));

  return (
    <CategorySectionCreator title={title} seeMoreLink='#'>
      {subtitle && <SubTitle>{subtitle}</SubTitle>}

      <Grid container spacing={3}>
        {productsJSX}
      </Grid>

      {pagination && pagination.hasNextPage && (
        <FlexRowCenter mt={6}>
          <LoadingButton
            loading={pagination.isFetchingNextPage}
            onClick={() => pagination.fetchNextPage()}
            variant='contained'
            color='primary'
            sx={{ fontSize: 13 }}
          >
            Tải thêm...
          </LoadingButton>
        </FlexRowCenter>
      )}
    </CategorySectionCreator>
  );
};

export default AllProducts;
