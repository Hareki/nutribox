import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IOrderStatus } from './types';

const OrderStatus = models?.OrderStatus as Model<IOrderStatus>;
export default OrderStatus;
