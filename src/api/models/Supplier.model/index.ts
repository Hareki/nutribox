import '../../database/mongoose.config';
import { Model, models } from 'mongoose';

import { ISupplier } from './types';

const Supplier = models.Supplier as Model<ISupplier>;
export default Supplier;
