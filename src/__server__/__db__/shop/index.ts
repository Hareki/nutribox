// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com
import Mock from '../../mock';

import shops from './data';

import products from 'data/product-database';
import Shop from 'models/Shop.model';

const getProducts = (slug: string) =>
  products.filter((item) => item?.shop?.slug === slug);

Mock.onGet('/api/shops').reply(async () => {
  try {
    return [200, shops];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/shops/single').reply(async (config) => {
  try {
    if (config?.params?.slug) {
      const shop: Shop = shops.find((item) => item.slug === config.params.slug);
      shop.products = getProducts(config.params.slug);
      return [200, shop];
    }

    const shop: Shop = shops[0];
    shop.products = getProducts(shops[0].slug);
    return [200, shop];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/shops/slugs').reply(async () => {
  try {
    const slugs = shops.map((item) => ({ params: { slug: item.slug } }));
    return [200, slugs];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
