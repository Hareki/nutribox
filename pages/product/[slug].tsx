import { Container, styled, Tabs } from '@mui/material';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Fragment } from 'react';

import {
  getProduct,
  getProductSlugs,
  getRelatedProducts,
} from 'api/base/server-side-getters';
import connectToDB from 'api/database/databaseConnection';
import { serialize } from 'api/helpers/object.helper';
import type { IUpeProduct } from 'api/models/Product.model/types';
import SEO from 'components/abstract/SEO';
import { H2 } from 'components/abstract/Typography';
import { Footer } from 'components/common/layout/footer';
import { getPageLayout } from 'components/layouts/PageLayout';
import ProductIntro from 'components/products/ProductIntro';
import RelatedProductsSection from 'components/products/RelatedProductsSection';
import { extractIdFromSlug } from 'helpers/product.helper';
import LoginDialog from 'pages-sections/auth/LoginDialog';

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

type ProductDetailsProps = {
  product: IUpeProduct;
  relatedProducts: IUpeProduct[];
};

ProductDetails.getLayout = getPageLayout;

function ProductDetails(props: ProductDetailsProps) {
  const { product, relatedProducts } = props;

  return (
    <Fragment>
      <SEO title={product.name} />
      <Container sx={{ my: 5 }}>
        {product ? (
          <ProductIntro product={product} sx={{ mb: 10 }} />
        ) : (
          <H2>Đang tải...</H2>
        )}

        <RelatedProductsSection products={relatedProducts} />
      </Container>
      <Footer />
      <LoginDialog />
    </Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  await connectToDB();

  const productSlugs = await getProductSlugs();

  const paths = productSlugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await connectToDB();

  const id = extractIdFromSlug(params.slug as string);

  const product = await getProduct(id);

  const productId = product.id;
  const categoryId = product.category.toString();

  const relatedProducts = await getRelatedProducts(productId, categoryId);

  return {
    props: {
      product: serialize(product),
      relatedProducts: serialize(relatedProducts),
    },
  };
};

export default ProductDetails;
