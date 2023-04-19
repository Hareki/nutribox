import '../../database/mongoose/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { IProductCategory } from './types';

const ProductCategoryModel = () =>
  models?.ProductCategory as Model<IProductCategory>;
export default ProductCategoryModel;
