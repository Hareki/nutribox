import Mock from '../../mock';

import * as db from './data';

Mock.onGet('/api/mock/services').reply(async () => {
  try {
    return [200, db.serviceList];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});

Mock.onGet('/api/mock/testimonial-list').reply(() => {
  try {
    return [200, db.testimonialList];
  } catch (err) {
    console.error(err);
    return [500, { message: 'Internal server error' }];
  }
});
