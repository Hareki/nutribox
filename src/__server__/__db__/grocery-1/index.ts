// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com
import shuffle from 'lodash/shuffle';

import Mock from '../../mock';

import * as db from './data';

const getProducts = (type: string) => {
  return db.products.filter((item) => item.for.type === type);
};

Mock.onGet('/api/grocery-1/navigation').reply(() => {
  try {
    return [200, db.categoryNavigation];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/services').reply(async () => {
  try {
    return [200, db.serviceList];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/products?tag=popular').reply(async () => {
  try {
    return [200, getProducts('popular-products')];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/products?tag=trending').reply(async () => {
  try {
    return [200, getProducts('trending-products')];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/products').reply(async () => {
  try {
    return [200, getProducts('all-products')];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/category-based-products').reply(async () => {
  try {
    return [200, shuffle(getProducts('all-products'))];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/main-carousel').reply(async () => {
  try {
    return [200, db.mainCarouselData];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/grocery-1/testimonial-list').reply(() => {
  try {
    return [200, db.testimonialList];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
