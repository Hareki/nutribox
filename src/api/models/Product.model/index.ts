import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IProduct } from './types';

const Product = models.Product as Model<IProduct>;
export default Product;
