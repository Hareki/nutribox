import { Box } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';

import ShopLayout1 from 'components/layouts/ShopLayout1';
import Newsletter from 'components/Newsletter';
import SEO from 'components/SEO';
import Setting from 'components/Setting';
import Product from 'models/Product.model';
import Service from 'models/Service.model';
import Section1 from 'pages-sections/fashion-shop-1/Section1';
import Section2 from 'pages-sections/fashion-shop-1/Section2';
import Section3 from 'pages-sections/fashion-shop-1/Section3';
import Section4 from 'pages-sections/fashion-shop-1/Section4';
import Section5 from 'pages-sections/fashion-shop-1/Section5';
import Section6 from 'pages-sections/fashion-shop-1/Section6';
import Section7 from 'pages-sections/fashion-shop-1/Section7';
import Section8 from 'pages-sections/fashion-shop-1/Section8';
import api from 'utils/__api__/fashion-shop';

// =======================================================
type FashionShop1Props = {
  hotDealList: any[];
  dealOfTheWeek: any[];
  serviceList: Service[];
  trendingItems: Product[];
  flashDealsData: Product[];
  newArrivalsData: Product[];
};
// =======================================================

const FashionShop1: NextPage<FashionShop1Props> = (props) => {
  return (
    <ShopLayout1 showTopbar={false}>
      <SEO title='Fashion shop template v1' />
      <Box sx={{ backgroundColor: '#ffffff', overFlow: 'hidden' }}>
        {/* HERO SECTION AND SERCIVE CARDS */}
        <Section1 />

        {/* FLASH DEALS */}
        <Section2 flashDeals={props.flashDealsData} />

        {/* NEW ARRIVALS */}
        <Section3 newArrivals={props.newArrivalsData} />

        {/* DEALS OF THE WEEK GRID CAROUSEL */}
        <Section4 dealOfTheWeek={props.dealOfTheWeek} />

        {/* HOT DEALS CAROUSEL */}
        <Section5 hotDealList={props.hotDealList} />

        {/* TRENDING ITEMS */}
        <Section6 products={props.trendingItems} />

        {/* SERVICE ITEMS */}
        <Section7 serviceList={props.serviceList} />

        {/* SUBSCRIBE NEWSLETTER */}
        <Section8 />

        {/* POPUP NEWSLETTER FORM */}
        <Newsletter />

        {/* SETTINGS IS USED ONLY FOR DEMO, YOU CAN REMOVE THIS */}
        <Setting />
      </Box>
    </ShopLayout1>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const hotDealList = await api.getHotDealList();
  const serviceList = await api.getServiceList();
  const flashDealsData = await api.getFlashDeals();
  const trendingItems = await api.getTrendingItems();
  const newArrivalsData = await api.getNewArrivals();
  const dealOfTheWeek = await api.getDealOfTheWeekList();

  return {
    props: {
      hotDealList,
      serviceList,
      dealOfTheWeek,
      trendingItems,
      flashDealsData,
      newArrivalsData,
    },
  };
};

export default FashionShop1;
