import { Stack } from '@mui/material';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { Footer1 } from 'components/footer';
import ShopLayout2 from 'components/layouts/ShopLayout2';
import { MobileNavigationBar2 } from 'components/mobile-navigation';
import SideNavbar from 'components/page-sidenav/SideNavbar';
import SEO from 'components/SEO';
import SidenavContainer from 'components/SidenavContainer';
import CategoryNavList from 'models/CategoryNavList.model';
import { MainCarouselItem } from 'models/Grocery-3.model';
import Product from 'models/Product.model';
import Service from 'models/Service.model';
import AllProducts from 'pages-sections/grocery1/AllProducts';
import ProductCarousel from 'pages-sections/grocery1/ProductCarousel';
import Section1 from 'pages-sections/grocery1/Section1';
import Section2 from 'pages-sections/grocery1/Section2';
import Section9 from 'pages-sections/grocery1/Section9';
import api from 'utils/__api__/grocery1-shop';

// =====================================================
type Grocery1Props = {
  products: Product[];
  serviceList: Service[];
  popularProducts: Product[];
  trendingProducts: Product[];
  grocery1NavList: CategoryNavList[];
  mainCarouselData: MainCarouselItem[];
  testimonials: any[];
};
// =====================================================

const Grocery1: NextPage<Grocery1Props> = (props) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);

  // FETCH PRODUCTS BASED ON THE SELECTED CATEGORY
  useEffect(() => {
    axios
      .get('/api/grocery-1/category-based-products', {
        params: { category: selectedCategory },
      })
      .then(({ data }) => setFilterProducts(data));
  }, [selectedCategory]);

  // HANDLE CHANGE CATEGORY
  const handleSelectCategory = (category: string) =>
    setSelectedCategory(category);

  // SIDE NAVBAR COMPONENT
  const SideNav = useCallback(
    () => (
      <SideNavbar
        navList={props.grocery1NavList}
        handleSelect={handleSelectCategory}
      />
    ),
    [props.grocery1NavList],
  );

  return (
    <ShopLayout2 showNavbar={false} showTopbar={false}>
      <SEO title='Nutribox - Nguồn dinh dưỡng tốt cho sức khoẻ' />
      {/* TOP HERO AREA */}
      <Section1 mainCarouselData={props.mainCarouselData} />

      {/* SERVICE AREA */}
      <Section2 id='grocery1Services' services={props.serviceList} />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <SidenavContainer
        navFixedComponentID='grocery1Services'
        SideNav={SideNav}
      >
        <Stack spacing={6} mt={2} mb={6}>
          {selectedCategory ? (
            // FILTERED PRODUCT LIST
            <AllProducts products={filterProducts} title={selectedCategory} />
          ) : (
            <Fragment>
              {/* POPULAR PRODUCTS AREA */}
              <ProductCarousel
                title='Popular Products'
                products={props.popularProducts}
              />

              {/* TRENDING PRODUCTS AREA */}
              <ProductCarousel
                title='Trending Products'
                products={props.trendingProducts}
              />

              {/* ALL PRODUCTS AREA */}
              <AllProducts products={props.products} />
            </Fragment>
          )}

          {/* CLIENT TESTIMONIALS AREA */}
          <Section9 testimonials={props.testimonials} />

          {/* FOOTER AREA */}
        </Stack>
      </SidenavContainer>
      <Footer1 />

      {/* MOBILE NAVIGATION WITH SIDE NAVBAR */}
      <MobileNavigationBar2>
        <SideNavbar navList={props.grocery1NavList} />
      </MobileNavigationBar2>
    </ShopLayout2>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mainCarouselData = await api.getMainCarousel();
  const products = await api.getProducts();
  const serviceList = await api.getServices();
  const popularProducts = await api.getPopularProducts();
  const trendingProducts = await api.getTrendingProducts();
  const grocery1NavList = await api.getGrocery1Navigation();
  const testimonials = await api.getTestimonials();

  return {
    props: {
      mainCarouselData,
      products,
      serviceList,
      grocery1NavList,
      popularProducts,
      trendingProducts,
      testimonials,
    },
  };
};

export default Grocery1;
