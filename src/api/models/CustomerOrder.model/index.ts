import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { ICustomerOrder } from './types';

const CustomerOrder = models.CustomerOrder as Model<ICustomerOrder>;
export default CustomerOrder;
