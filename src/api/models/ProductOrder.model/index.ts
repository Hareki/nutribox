import '../../database/mongoose.config';

import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IProductOrder } from './types';

const ProductOrder = models.ProductOrder as Model<IProductOrder>;
export default ProductOrder;
