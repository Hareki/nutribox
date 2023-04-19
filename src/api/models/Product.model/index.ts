import '../../database/mongoose/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IProduct } from './types';

const ProductModel = () => models?.Product as Model<IProduct>;
export default ProductModel;
