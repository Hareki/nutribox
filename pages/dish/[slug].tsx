import { Box, Container, styled, Tab, Tabs } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import ShopLayout2 from 'components/layouts/ShopLayout2';
import ProductDescription from 'components/products/ProductDescription';
import ProductIntro from 'components/products/ProductIntro';
import RelatedProductsSection from 'components/products/RelatedProductsSection';
import { H2 } from 'components/Typography';
import Product from 'models/Product.model';
import api from 'utils/__api__/products';
import {
  getFrequentlyBought,
  getRelatedProducts,
} from 'utils/__api__/related-products';

// styled component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  '& .inner-tab': {
    minHeight: 40,
    fontWeight: 600,
    textTransform: 'capitalize',
  },
}));

// ===============================================================
type ProductDetailsProps = {
  product: Product;
  relatedProducts: Product[];
  frequentlyBought: Product[];
};
// ===============================================================

const ProductDetails: FC<ProductDetailsProps> = (props) => {
  const { frequentlyBought, relatedProducts, product } = props;

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(0);

  const handleOptionClick = (_, value: number) => setSelectedOption(value);

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <ShopLayout2>
      <Container sx={{ my: 4 }}>
        {/* PRODUCT DETAILS INFO AREA */}
        {product ? <ProductIntro product={product} /> : <H2>Loading...</H2>}

        {/* PRODUCT DESCRIPTION */}
        <StyledTabs
          textColor='primary'
          value={selectedOption}
          indicatorColor='primary'
          onChange={handleOptionClick}
        >
          <Tab className='inner-tab' label='Description' />
        </StyledTabs>

        <Box mb={6}>{selectedOption === 0 && <ProductDescription />}</Box>

        {relatedProducts && (
          <RelatedProductsSection productsData={relatedProducts} />
        )}
      </Container>
    </ShopLayout2>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await api.getSlugs();

  return {
    paths: paths, // indicates that no page needs be created at build time
    fallback: 'blocking', // indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const relatedProducts = await getRelatedProducts();
  const frequentlyBought = await getFrequentlyBought();
  const product = await api.getProduct(params.slug as string);

  return { props: { frequentlyBought, relatedProducts, product } };
};

export default ProductDetails;
