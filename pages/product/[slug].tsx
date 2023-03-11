import { Container, styled, Tabs } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FC } from 'react';


import { IProduct } from 'api/models/Product.model/types';
import { Footer } from 'components/footer';
import ShopLayout1 from 'components/layouts/ShopLayout1';
import ProductIntro from 'components/products/ProductIntro';
import RelatedProductsSection from 'components/products/RelatedProductsSection';
import { H2 } from 'components/Typography';
import realApi from 'utils/__api__/real/product/[slug]';



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
  product: IProduct;
  relatedProducts: IProduct[];
};
// ===============================================================

const ProductDetails: FC<ProductDetailsProps> = (props) => {
  const { product, relatedProducts } = props;

  const router = useRouter();

  // Show a loading state when the fallback is rendered
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <ShopLayout1 showTopbar={false} showNavbar={false}>
      <Container sx={{ my: 5 }}>
        {product ? (
          <ProductIntro product={product} sx={{ mb: 10 }} />
        ) : (
          <H2>Loading...</H2>
        )}

        <RelatedProductsSection products={relatedProducts} />
      </Container>
      <Footer />
    </ShopLayout1>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const productSlugs = await realApi.getSlugs();

  const paths = productSlugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await realApi.getProduct(params.slug as string);
  const productId = product.id;
  const categoryId = product.category.toString();

  const relatedProducts = await realApi.getRelatedProducts(
    productId,
    categoryId,
  );

  return { props: { product, relatedProducts } };
};

export default ProductDetails;
