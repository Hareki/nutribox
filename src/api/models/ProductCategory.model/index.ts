import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IProductCategory } from './types';

const ProductCategory = models.ProductCategory as Model<IProductCategory>;
export default ProductCategory;
