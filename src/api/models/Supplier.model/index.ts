import '../../database/mongoose.config';
import type { Model } from 'mongoose';
import { models } from 'mongoose';

import type { ISupplier } from './types';

const Supplier = models.Supplier as Model<ISupplier>;
export default Supplier;
