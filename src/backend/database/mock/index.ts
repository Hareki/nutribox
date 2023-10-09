import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { services } from './data/services';
import { testimonials } from './data/testimonials';

import { MOCK_ROUTE } from 'constants/routes.constant';
const Mock = new MockAdapter(axios, { onNoMatch: 'passthrough' });

Mock.onGet(`${MOCK_ROUTE}/services`).reply(() => {
  try {
    return [200, services];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet(`${MOCK_ROUTE}/testimonials`).reply(() => {
  try {
    return [200, testimonials];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
