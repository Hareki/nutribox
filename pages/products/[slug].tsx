import { Container } from '@mui/material';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment } from 'react';

import type { CommonProductModel } from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import { StoreService } from 'backend/services/store/store.service';
import SEO from 'components/abstract/SEO';
import { H2 } from 'components/abstract/Typography';
import { Footer } from 'components/common/layout/footer';
import { getPageLayout } from 'components/layouts/PageLayout';
import ProductIntro from 'components/products/ProductIntro';
import RelatedProductsSection from 'components/products/RelatedProductsSection';
import { DEFAULT_RELATED_PRODUCTS_LIMIT } from 'constants/pagination.constant';
import { STORE_ID } from 'constants/temp.constant';
import { extractIdFromSlug } from 'helpers/product.helper';
import type { PopulateStoreFields } from 'models/store.model';
import SignInDialog from 'pages-sections/auth/SignInDialog';
import { serialize } from 'utils/string.helper';

// styled component
// const StyledTabs = styled(Tabs)(({ theme }) => ({
//   minHeight: 0,
//   marginTop: 80,
//   marginBottom: 24,
//   borderBottom: `1px solid ${theme.palette.text.disabled}`,
//   '& .inner-tab': {
//     minHeight: 40,
//     fontWeight: 600,
//     textTransform: 'capitalize',
//   },
// }));

type ProductDetailsProps = {
  product: CommonProductModel;
  relatedProducts: CommonProductModel[];
  initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>;
};

ProductDetails.getLayout = getPageLayout;
ProductDetails.haveOwnFooter = true;

function ProductDetails(props: ProductDetailsProps) {
  const { product, relatedProducts, initialStoreInfo } = props;

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
      <SignInDialog />
      <Footer initialStoreInfo={initialStoreInfo} />
    </Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const productSlugs = await ProductService.getProductSlugs();

  const paths = productSlugs.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const id = extractIdFromSlug(params?.slug as string);

  const { relatedProducts, ...product } =
    await ProductService.getProductWithRelatedProducts(
      id,
      DEFAULT_RELATED_PRODUCTS_LIMIT,
    );

  const initialStoreInfo =
    await StoreService.getStoreInfoAndWorkTimes(STORE_ID);

  if (!product?.available) {
    return {
      notFound: true,
    };
  }

  const locales = await serverSideTranslations(locale ?? 'vn', [
    'cartItem',
    'common',
  ]);

  return {
    props: {
      product: serialize(product),
      initialStoreInfo: serialize(initialStoreInfo),
      relatedProducts: serialize(relatedProducts),
      ...locales,
    },
  };
};

export default ProductDetails;
