import '../../database/mongoose/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { ICustomerOrder } from './types';

const CustomerOrderModel = () => models?.CustomerOrder as Model<ICustomerOrder>;
export default CustomerOrderModel;
