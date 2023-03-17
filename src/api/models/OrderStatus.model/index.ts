import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IOrderStatus } from './types';

const OrderStatus = models?.OrderStatus as Model<IOrderStatus>;
export default OrderStatus;
