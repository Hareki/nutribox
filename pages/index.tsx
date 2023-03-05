import { Stack } from '@mui/material';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import { Fragment, useCallback, useEffect, useState } from 'react';

// Footer1
import { Footer } from 'components/footer';
// ShopLayout2
import ShopLayout1 from 'components/layouts/ShopLayout1';
// MobileNavigationBar2
import { MobileNavigationBar } from 'components/mobile-navigation';
import SideNavbar from 'components/page-sidenav/SideNavbar';
import SEO from 'components/SEO';
import SidenavContainer from 'components/SidenavContainer';
import CategoryNavList from 'models/CategoryNavList.model';
import { MainCarouselItem } from 'models/Grocery-3.model';
import Product from 'models/Product.model';
import Service from 'models/Service.model';
import AllProducts from 'pages-sections/home-page/AllProducts';
import HeroSection from 'pages-sections/home-page/HeroSection';
import ProductCarousel from 'pages-sections/home-page/ProductCarousel';
import ServicesSection from 'pages-sections/home-page/ServicesSection';
import TestimonialsSection from 'pages-sections/home-page/TestimonialsSection';
import api from 'utils/__api__/grocery1-shop';

function getElementHeightIncludingMargin(element: HTMLElement) {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  const marginTop = parseFloat(styles.marginTop);
  const marginBottom = parseFloat(styles.marginBottom);
  const rect = element.getBoundingClientRect();
  return rect.height + marginTop + marginBottom;
}

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

  const [sideNavBottomOffset, setSideNavBottomOffset] = useState('0px');
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const mainContent = document.getElementById('main-content');
      const productsSection = document.getElementById('products-section');

      const mainContentHeight = getElementHeightIncludingMargin(mainContent);
      const productsSectionHeight =
        getElementHeightIncludingMargin(productsSection);

      const result = `${mainContentHeight - productsSectionHeight}px`;
      setSideNavBottomOffset(result);
    }
  }, []);

  // FETCH PRODUCTS BASED ON THE SELECTED CATEGORY
  useEffect(() => {
    axios
      .get('/api/grocery-1/category-based-products', {
        params: { category: selectedCategory },
      })
      .then(({ data }) => setFilterProducts(data));
  }, [selectedCategory]);

  const handleSelectCategory = (category: string) => {
    if (category === 'Tất cả') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  const SideNav = useCallback(
    () => (
      <SideNavbar navList={props.navList} handleSelect={handleSelectCategory} />
    ),
    [props.navList],
  );

  return (
    <ShopLayout1 showNavbar={false} showTopbar={false}>
      <SEO title='Trang chủ' />
      <HeroSection mainCarouselData={props.mainCarouselData} />
      <ServicesSection services={props.serviceList} />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <SidenavContainer
        sideNavBottomOffset={sideNavBottomOffset}
        SideNav={SideNav}
      >
        <Stack id='main-content' spacing={6} mt={2} mb={6}>
          <div id='products-section'>
            {selectedCategory ? (
              // FILTERED PRODUCT LIST
              <AllProducts products={filterProducts} title={selectedCategory} />
            ) : (
              <Fragment>
                {/* <ProductCarousel
                  title='Popular Products'
                  products={props.popularProducts}
                /> */}

                <ProductCarousel
                  title='Món ăn mới'
                  products={props.trendingProducts}
                />

                <AllProducts products={props.products} />
              </Fragment>
            )}
          </div>
          <TestimonialsSection testimonials={props.testimonials} />
        </Stack>
      </SidenavContainer>
      <Footer />

      {/* MOBILE NAVIGATION WITH SIDE NAVBAR */}
      <MobileNavigationBar>
        <SideNavbar navList={props.navList} />
      </MobileNavigationBar>
    </ShopLayout1>
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
