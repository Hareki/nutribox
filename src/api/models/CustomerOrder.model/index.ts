import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { ICustomerOrder } from './types';

const CustomerOrder = models.CustomerOrder as Model<ICustomerOrder>;
export default CustomerOrder;
