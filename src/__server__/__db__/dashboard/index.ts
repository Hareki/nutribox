import Mock from '../../mock';

import { brands } from './brand';
import { categories } from './categories';
import { customers } from './customers';
import { cardList, recentPurchase, stockOutProducts } from './data';
import { earningHistory } from './earning-history';
import { orders } from './orders';
import { packagePayments } from './package-payments';
import { payoutRequests } from './payout-requests';
import { payouts } from './payouts';
import { products } from './products';
import { refundRequest } from './refundRequests';
import { reviews } from './reviews';
import { sellers } from './sellers';

// dashboard
Mock.onGet('/api/admin/dashboard-cards').reply(() => {
  try {
    return [200, cardList];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/recent-purchase').reply(() => {
  try {
    return [200, recentPurchase];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/stock-out-products').reply(() => {
  try {
    return [200, stockOutProducts];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

// products
Mock.onGet('/api/admin/products').reply(() => {
  try {
    return [200, products];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/category').reply(() => {
  try {
    return [200, categories];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/brands').reply(() => {
  try {
    return [200, brands];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/reviews').reply(() => {
  try {
    return [200, reviews];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

// orders
Mock.onGet('/api/admin/orders').reply(() => {
  try {
    return [200, orders];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/orders/1').reply((config) => {
  try {
    if (config?.params?.id) {
      const order = orders.find((item) => item.id === config.params.id);
      return [200, order];
    }

    return [200, orders[0]];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/customers').reply(() => {
  try {
    return [200, customers];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/refund-requests').reply(() => {
  try {
    return [200, refundRequest];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/sellers').reply(() => {
  try {
    return [200, sellers];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/package-payments').reply(() => {
  try {
    return [200, packagePayments];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/earning-history').reply(() => {
  try {
    return [200, earningHistory];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/payouts').reply(() => {
  try {
    return [200, payouts];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/admin/payout-requests').reply(() => {
  try {
    return [200, payoutRequests];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
