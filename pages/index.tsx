import { Stack } from '@mui/material';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import { Fragment, useCallback, useEffect, useState } from 'react';

// Footer1
import { Footer } from 'components/footer';
// ShopLayout2
import ShopLayout from 'components/layouts/ShopLayout';
// MobileNavigationBar2
import { MobileNavigationBar } from 'components/mobile-navigation';
import SideNavbar from 'components/page-sidenav/SideNavbar';
import SEO from 'components/SEO';
import SidenavContainer from 'components/SidenavContainer';
import CategoryNavList from 'models/CategoryNavList.model';
import { MainCarouselItem } from 'models/Grocery-3.model';
import Product from 'models/Product.model';
import Service from 'models/Service.model';
import AllProducts from 'pages-sections/grocery1/AllProducts';
import HeroSection from 'pages-sections/grocery1/HeroSection';
import ProductCarousel from 'pages-sections/grocery1/ProductCarousel';
import ServicesSection from 'pages-sections/grocery1/ServicesSection';
import TestimonialsSection from 'pages-sections/grocery1/TestimonialsSection';
import api from 'utils/__api__/grocery1-shop';

type HomePageProps = {
  products: Product[];
  serviceList: Service[];
  popularProducts: Product[];
  trendingProducts: Product[];
  navList: CategoryNavList[];
  mainCarouselData: MainCarouselItem[];
  testimonials: any[];
};

const HomePage: NextPage<HomePageProps> = (props) => {
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

  const handleSelectCategory = (category: string) =>
    setSelectedCategory(category);

  const SideNav = useCallback(
    () => (
      <SideNavbar navList={props.navList} handleSelect={handleSelectCategory} />
    ),
    [props.navList],
  );

  return (
    <ShopLayout showNavbar={false} showTopbar={false}>
      <SEO title='Nutribox - Nguồn dinh dưỡng tốt cho sức khoẻ' />
      <HeroSection mainCarouselData={props.mainCarouselData} />
      <ServicesSection id='services-section' services={props.serviceList} />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <SidenavContainer
        navFixedComponentID='services-section'
        SideNav={SideNav}
      >
        <Stack spacing={6} mt={2} mb={6}>
          {selectedCategory ? (
            // FILTERED PRODUCT LIST
            <AllProducts products={filterProducts} title={selectedCategory} />
          ) : (
            <Fragment>
              <ProductCarousel
                title='Popular Products'
                products={props.popularProducts}
              />

              <ProductCarousel
                title='Trending Products'
                products={props.trendingProducts}
              />

              <AllProducts products={props.products} />
            </Fragment>
          )}

          <TestimonialsSection testimonials={props.testimonials} />
        </Stack>
      </SidenavContainer>
      <Footer />

      {/* MOBILE NAVIGATION WITH SIDE NAVBAR */}
      <MobileNavigationBar>
        <SideNavbar navList={props.navList} />
      </MobileNavigationBar>
    </ShopLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const mainCarouselData = await api.getMainCarousel();
  const products = await api.getProducts();
  const serviceList = await api.getServices();
  const popularProducts = await api.getPopularProducts();
  const trendingProducts = await api.getTrendingProducts();
  const navList = await api.getNavList();
  const testimonials = await api.getTestimonials();

  return {
    props: {
      mainCarouselData,
      products,
      serviceList,
      navList,
      popularProducts,
      trendingProducts,
      testimonials,
    },
  };
};

export default HomePage;
