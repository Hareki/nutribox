import '../../database/mongoose.config';

import { Model, models } from 'mongoose';

import { IProductOrder } from './types';

const ProductOrder = models.ProductOrder as Model<IProductOrder>;
export default ProductOrder;
