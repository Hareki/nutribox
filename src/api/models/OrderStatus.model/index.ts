import '../../database/mongoose/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IOrderStatus } from './types';

const OrderStatusModel = () => models?.OrderStatus as Model<IOrderStatus>;
export default OrderStatusModel;
