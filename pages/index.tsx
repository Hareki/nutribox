import { Stack } from '@mui/material';
import {
  dehydrate,
  QueryClient,
  useInfiniteQuery,
  useQueries,
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import homePageCaller, { allCategory } from 'api-callers';
import { Mock } from 'api-callers/mock';
import searchApiCaller from 'api-callers/product/search';
import type { Service } from 'backend/database/mock/services';
import type { Testimonial } from 'backend/database/mock/testimonials';
import { ProductEntity } from 'backend/entities/product.entity';
import { ProductCategoryEntity } from 'backend/entities/productCategory.entity';
import { CommonService } from 'backend/services/common/common.service';
import type { CommonProductModel } from 'backend/services/product/helper';
import { CommonProductRelations } from 'backend/services/product/helper';
import { ProductService } from 'backend/services/product/product.service';
import { StoreService } from 'backend/services/store/store.service';
import SEO from 'components/abstract/SEO';
import { Footer } from 'components/common/layout/footer';
import { getPageLayout } from 'components/layouts/PageLayout';
import { MobileNavigationBar } from 'components/mobile-navigation';
import CategoryNavbar from 'components/page-sidenav/CategoryNavbar';
import SideNavContainer from 'components/side-nav/SidenavContainer';
import {
  DEFAULT_DOCS_PER_PAGE,
  DEFAULT_HOT_PRODUCTS_LIMIT,
  DEFAULT_NEW_PRODUCTS_LIMIT,
  DEFAULT_PAGE,
} from 'constants/pagination.constant';
import type { ProductCategoryModel } from 'models/productCategory.model';
import type { PopulateStoreFields } from 'models/store.model';
import LoginDialog from 'pages-sections/auth/LoginDialog';
import AllProducts from 'pages-sections/home-page/AllProducts';
import HeroSection from 'pages-sections/home-page/HeroSection';
import ProductCarousel from 'pages-sections/home-page/ProductCarousel';
import ServicesSection from 'pages-sections/home-page/ServicesSection';
import TestimonialsSection from 'pages-sections/home-page/TestimonialsSection';
import type { GetInfinitePaginationResult } from 'types/pagination';
import { serialize } from 'utils/string.helper';

function getElementHeightIncludingMargin(element: HTMLElement | null) {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  const marginTop = parseFloat(styles.marginTop);
  const marginBottom = parseFloat(styles.marginBottom);
  const rect = element.getBoundingClientRect();
  return rect.height + marginTop + marginBottom;
}

type HomePageProps = {
  serviceList: Service[];
  testimonials: Testimonial[];
  initialStoreInfo: PopulateStoreFields<'storeWorkTimes'>;
};

HomePage.getLayout = getPageLayout;
HomePage.haveOwnFooter = true;

function HomePage(props: HomePageProps) {
  const { t } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [filterProducts, setFilterProducts] = useState<CommonProductModel[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sideNavBottomOffset, setSideNavBottomOffset] = useState('0px');
  const router = useRouter();

  const [overrideSearchResult, setOverrideSearchResult] = useState(false);
  const { query } = router;

  const searchQuery = query?.productName as string;

  const { data: searchResult, isLoading: isSearching } = useQuery({
    queryKey: ['product', 'search', searchQuery],
    queryFn: (context) =>
      searchApiCaller.searchProductsByName(context.queryKey[2]),
    initialData: [],
    enabled: !!searchQuery,
  });

  useEffect(() => {
    console.log(router.asPath);
    setOverrideSearchResult(false);
  }, [router.asPath]);

  useEffect(() => {
    if (searchQuery) {
      setSelectedCategoryId(undefined);
      setSelectedCategoryName('Tất cả');
    }
  }, [searchQuery]);

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
    queryFn: homePageCaller.getAllCategories,
  });

  const {
    data: allProductsPagination,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<GetInfinitePaginationResult<CommonProductModel>>({
    queryKey: ['products', 'infinite', { categoryId: undefined }],
    queryFn: ({ pageParam }) => {
      if (!pageParam) pageParam = 1;
      return homePageCaller.getAllProducts(pageParam);
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPageNum < 0 ? undefined : lastPage.nextPageNum,
  });

  const allProducts = useMemo(() => {
    return (
      allProductsPagination?.pages.reduce<CommonProductModel[]>(
        (acc, page) => [...acc, ...page.docs],
        [],
      ) || []
    );
  }, [allProductsPagination?.pages]);

  const { data: hotProducts } = useQuery({
    queryKey: ['products', 'hot'],
    queryFn: homePageCaller.getHotProducts,
  });

  const { data: newProducts } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: homePageCaller.getNewProducts,
  });

  const categoryQueries = useMemo(() => {
    return (
      categoryNavigation?.filter((category) => {
        return category.id !== '';
      }) || []
    );
  }, [categoryNavigation]);

  const results = useQueries({
    queries: categoryQueries.map((category) => {
      return {
        queryKey: ['products', 'category', category.id],
        queryFn: () => {
          setIsLoading(true);
          return homePageCaller.getCategoryWithProducts(category.id);
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
    setFilterProducts(category?.data?.products || []);
  }, [selectedCategoryId, results]);

  // FIXME Kinda buggy, but it works
  const handleSelectCategory = useCallback(
    (categoryId: string, categoryName: string) => {
      setOverrideSearchResult(true);
      setSelectedCategoryId(categoryId);
      setSelectedCategoryName(categoryName);
    },
    [],
  );

  const SideNav = useCallback(
    () => (
      <CategoryNavbar
        navList={categoryNavigation || []}
        handleSelect={handleSelectCategory}
      />
    ),
    [categoryNavigation, handleSelectCategory],
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
            {!!searchQuery && !overrideSearchResult && (
              <AllProducts
                isLoading={isSearching}
                products={searchResult}
                title={`Kết quả tìm kiếm cho "${searchQuery}"`}
              />
            )}

            {selectedCategoryId && (!searchQuery || overrideSearchResult) && (
              <AllProducts
                isLoading={isLoading}
                products={filterProducts}
                title={selectedCategoryName}
              />
            )}

            {!selectedCategoryId && (!searchQuery || overrideSearchResult) && (
              <>
                <ProductCarousel
                  title='Các sản phẩm mới'
                  subtitle='Trải nghiệm thử các sản phẩm mới đến từ Nutribox!'
                  products={newProducts || []}
                />

                <ProductCarousel
                  title='Các sản phẩm bán chạy'
                  subtitle='Khám phá các sản phẩm được nhiều khách hàng săn đón!'
                  products={hotProducts || []}
                />

                <AllProducts
                  products={allProducts || []}
                  pagination={{
                    fetchNextPage,
                    hasNextPage: !!hasNextPage,
                    isFetchingNextPage,
                  }}
                />
              </>
            )}
          </div>
          <TestimonialsSection testimonials={props.testimonials} />
        </Stack>
      </SideNavContainer>

      <MobileNavigationBar>
        <CategoryNavbar navList={categoryNavigation || []} />
      </MobileNavigationBar>
      <LoginDialog />
      <Footer initialStoreInfo={props.initialStoreInfo} />
      <ReactQueryDevtools />
    </Fragment>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const serviceList = await Mock.getServices();
  const testimonials = await Mock.getTestimonials();

  const queryClient = new QueryClient();

  const getAllCategories = async () => {
    const [categories] = await CommonService.getRecords({
      entity: ProductCategoryEntity,
    });
    (categories as ProductCategoryModel[]).unshift(allCategory);

    return categories;
  };

  const getPaginatedProducts = async (): Promise<
    GetInfinitePaginationResult<CommonProductModel>
  > => {
    const [data, totalDocs, nextPageNum] = await CommonService.getRecords({
      entity: ProductEntity,
      relations: CommonProductRelations,
      paginationParams: {
        limit: DEFAULT_DOCS_PER_PAGE,
        page: DEFAULT_PAGE,
      },
    });

    return {
      nextPageNum,
      totalDocs,
      docs: data as CommonProductModel[],
    };
  };

  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });

  await queryClient.prefetchQuery({
    queryKey: ['products', 'hot'],
    queryFn: () => ProductService.getHotProducts(DEFAULT_HOT_PRODUCTS_LIMIT),
  });

  await queryClient.prefetchQuery({
    queryKey: ['products', 'new'],
    queryFn: () => ProductService.getNewProducts(DEFAULT_NEW_PRODUCTS_LIMIT),
  });

  const initialStoreInfo = await StoreService.getStoreInfo();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', 'infinite', { categoryId: undefined }],
    initialData: {
      pageParams: [1],
      pages: [],
    },
    queryFn: getPaginatedProducts,
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
