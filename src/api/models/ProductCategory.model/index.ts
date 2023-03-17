import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IProductCategory } from './types';

const ProductCategory = models.ProductCategory as Model<IProductCategory>;
export default ProductCategory;
