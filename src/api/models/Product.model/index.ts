import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { IProduct } from './types';

const Product = models.Product as Model<IProduct>;
export default Product;
