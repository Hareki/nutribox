import { Stack } from '@mui/material';
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQueries,
  useQuery,
} from '@tanstack/react-query';
import type { GetStaticProps } from 'next';
import { useCallback, useEffect, useState, useMemo, Fragment } from 'react';

import {
  getAllCategories,
  getAllProducts,
  getHotProducts,
  getNewProducts,
  getStore,
} from 'api/base/server-side-getters';
import connectToDB from 'api/database/databaseConnection';
import { serialize } from 'api/helpers/object.helper';
import type { IUpeProduct } from 'api/models/Product.model/types';
import type { IStore } from 'api/models/Store.model/types';
import type { GetInfinitePaginationResult } from 'api/types/pagination.type';
import SEO from 'components/abstract/SEO';
import { Footer } from 'components/common/layout/footer';
import { getPageLayout } from 'components/layouts/PageLayout';
// MobileNavigationBar2
import { MobileNavigationBar } from 'components/mobile-navigation';
import CategoryNavbar from 'components/page-sidenav/CategoryNavbar';
import SideNavContainer from 'components/side-nav/SidenavContainer';
import type { MainCarouselItem } from 'models/Grocery-3.model';
import type Service from 'models/Service.model';
import LoginDialog from 'pages-sections/auth/LoginDialog';
import AllProducts from 'pages-sections/home-page/AllProducts';
import HeroSection from 'pages-sections/home-page/HeroSection';
import ProductCarousel from 'pages-sections/home-page/ProductCarousel';
import ServicesSection from 'pages-sections/home-page/ServicesSection';
import TestimonialsSection from 'pages-sections/home-page/TestimonialsSection';
import api from 'utils/__api__/grocery1-shop';
import apiCaller from 'utils/apiCallers';
import { ProductPaginationConstant, StoreId } from 'utils/constants';

function getElementHeightIncludingMargin(element: HTMLElement) {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  const marginTop = parseFloat(styles.marginTop);
  const marginBottom = parseFloat(styles.marginBottom);
  const rect = element.getBoundingClientRect();
  return rect.height + marginTop + marginBottom;
}

type HomePageProps = {
  hotProducts: IUpeProduct[];
  newProducts: IUpeProduct[];

  serviceList: Service[];
  mainCarouselData: MainCarouselItem[];
  testimonials: any[];

  initialStoreInfo: IStore;
};

HomePage.getLayout = getPageLayout;
HomePage.haveOwnFooter = true;

function HomePage(props: HomePageProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [filterProducts, setFilterProducts] = useState<IUpeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const { data: categoryNavigation } = useQuery({
    queryKey: ['products', 'category-navigation'],
    queryFn: apiCaller.getAllCategories,
  });

  const {
    data: allProductsPagination,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetInfinitePaginationResult<IUpeProduct>>({
    queryKey: ['products', 'infinite', { categoryId: undefined }],
    // CAN access the initial pageParam here, if initial pageParam is NOT specified, it will be NULL
    // Can NOT set a default value for pageParam like this ({ pageParam = 1}). Because default value has no effect with NULL, only with UNDEFINED.
    queryFn: ({ pageParam }) => {
      if (!pageParam) pageParam = 1; // Even with this, it will still be NULL in pageParams, if initial pageParam is not specified.
      return apiCaller.getAllProducts(pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPageNum < 0 ? undefined : lastPage.nextPageNum,
  });

  const allProducts = useMemo(() => {
    return allProductsPagination?.pages?.reduce(
      (acc, page) => [...acc, ...page.docs],
      [],
    );
  }, [allProductsPagination?.pages]);

  const { data: hotProducts } = useQuery({
    queryKey: ['products', 'hot'],
    queryFn: apiCaller.getHotProducts,
  });

  const { data: newProducts } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: apiCaller.getNewProducts,
  });

  const categoryQueries = useMemo(() => {
    return categoryNavigation?.filter((category) => {
      return category.id !== '';
    });
  }, [categoryNavigation]);

  const results = useQueries({
    queries: categoryQueries.map((category) => {
      return {
        queryKey: ['products', 'category', category.id],
        queryFn: () => {
          setIsLoading(true);
          return apiCaller.getCategoryWithProducts(category.id);
        },
        enabled: selectedCategoryId === category.id,
        onSettled: () => {
          setIsLoading(false);
        },
      };
    }),
  });

  useEffect(() => {
    if (!selectedCategoryId) return;
    const category = results.find(
      (result) => result.data?.id === selectedCategoryId,
    );
    setFilterProducts(category?.data?.products);
  }, [selectedCategoryId, results]);

  const handleSelectCategory = (categoryId: string, categoryName: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategoryName(categoryName);
  };

  const SideNav = useCallback(
    () => (
      <CategoryNavbar
        navList={categoryNavigation}
        handleSelect={handleSelectCategory}
      />
    ),
    [categoryNavigation],
  );

  return (
    <Fragment>
      <SEO title='Trang chủ' />
      <HeroSection />
      <ServicesSection services={props.serviceList} />

      {/* SIDEBAR WITH OTHER CONTENTS */}
      <SideNavContainer
        sideNavBottomOffset={sideNavBottomOffset}
        SideNav={SideNav}
      >
        <Stack id='main-content' spacing={6} mt={2} mb={6}>
          <div id='products-section'>
            {selectedCategoryId ? (
              <AllProducts
                isLoading={isLoading}
                products={filterProducts}
                title={selectedCategoryName}
              />
            ) : (
              <>
                <ProductCarousel
                  title='Các sản phẩm mới'
                  subtitle='Trải nghiệm thử các sản phẩm mới đến từ Nutribox!'
                  products={newProducts}
                />

                <ProductCarousel
                  title='Các sản phẩm bán chạy'
                  subtitle='Khám phá các sản phẩm được nhiều khách hàng săn đón!'
                  products={hotProducts}
                />

                <AllProducts
                  products={allProducts}
                  pagination={{
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                  }}
                />
              </>
            )}
          </div>
          <TestimonialsSection testimonials={props.testimonials} />
        </Stack>
      </SideNavContainer>

      {/* MOBILE NAVIGATION WITH SIDE NAVBAR */}
      <MobileNavigationBar>
        <CategoryNavbar navList={categoryNavigation} />
      </MobileNavigationBar>
      <LoginDialog />
      <Footer initialStoreInfo={props.initialStoreInfo} />
    </Fragment>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  await connectToDB();

  const serviceList = await api.getServices();
  const testimonials = await api.getTestimonials();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['products', 'category-navigation'],
    queryFn: () => getAllCategories(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['products', 'hot'],
    queryFn: () => getHotProducts(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['products', 'new'],
    queryFn: () => getNewProducts(),
  });

  const initialStoreInfo = await getStore(StoreId);

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', 'infinite', { categoryId: undefined }],
    initialData: {
      // declare the initial pageParam, used to fetch the FIRST page in useInfiniteQuery
      pageParams: [1],
      pages: [],
    },
    // Can NOT access the initial pageParam here, it will be UNDEFINED. Specify the initial pageParam or not, it's always be UNDEFINED
    queryFn: () =>
      getAllProducts(ProductPaginationConstant.docsPerPage.toString(), '1', []),
  });

  return {
    props: {
      serviceList,
      testimonials,
      initialStoreInfo: serialize(initialStoreInfo),
      dehydratedState: serialize(dehydrate(queryClient)),
    },
  };
};

export default HomePage;
